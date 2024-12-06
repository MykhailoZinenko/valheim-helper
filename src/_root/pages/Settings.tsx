import { useUserContext } from "@/context/AuthContext"
import { useState } from "react"
import { useTheme } from "@/components/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Copy, InfoIcon, Plus, XCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import UpgradeCTA from "@/components/shared/UpgradeCTA"
import { useGetDevelopKeys } from "@/lib/react-query/queriesAndMutations"
import Loader from "@/components/shared/Loader"

const Settings = () => {
  const { theme, themeKeys, setTheme } = useTheme()
  const { user, createApiKey, revokeApiKey } = useUserContext()
  const { toast } = useToast()
  const [newKeyName, setNewKeyName] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  const { data: apiKeys, isPending, isError } = useGetDevelopKeys(user.id)

  const [showRevoked, setShowRevoked] = useState(
    JSON.parse(localStorage.getItem(`show-revoked`) ?? "true")
  )

  const activeKeysCount =
    isPending || isError
      ? 0
      : apiKeys.keysData.filter((key) => key.status === "active").length

  const handleCreateKey = async () => {
    try {
      setIsCreating(true)
      const newKey = await createApiKey(newKeyName)
      if (newKey) {
        toast({
          title: "Success",
          description: "API key created successfully",
        })
        setNewKeyName("")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRevokeKey = async (keyId: string) => {
    try {
      await revokeApiKey(keyId)
      toast({
        title: "Success",
        description: "API key revoked successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    })
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl md:text-5xl font-norse font-bold text-color-text-primary">
        Customize your experience
      </h1>

      <div className="space-y-6">
        <h2 className="text-2xl md:text-3xl font-norse font-bold text-color-text-secondary">
          Make it personal
        </h2>

        <Card>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex-col items-start sm:flex-row flex gap-4 sm:items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">
                  Select your preferred theme
                </p>
              </div>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-full sm:max-w-[250px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(themeKeys).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-2 justify-between">
          <h2 className="text-2xl md:text-3xl font-norse font-bold text-color-text-secondary">
            Developer API Keys
          </h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-revoked"
              onCheckedChange={() => {
                setShowRevoked(!showRevoked)
                localStorage.setItem(
                  `show-revoked`,
                  JSON.stringify(!showRevoked)
                )
              }}
            />
            <label
              htmlFor="auto-delete"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hidden sm:block"
            >
              Show revoked API keys
            </label>
            <label
              htmlFor="auto-delete"
              className="block sm:hidden text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon className="w-5 h-5 text-accent" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show revoked API keys</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </label>
          </div>
        </div>

        {isPending || isError ? (
          <div className="w-full h-full flex items-center justify-center">
            <Loader size="lg" />
          </div>
        ) : (
          <Card>
            <CardContent className="p-4 sm:p-6 space-y-4">
              <div className="flex-col sm:flex-row flex justify-between items-center gap-4 text-pretty">
                <div className="flex space-y-0.5 flex-col items-center sm:items-start">
                  <p className="text-md text-muted-foreground text-center sm:text-left">
                    Manage your API keys for accessing the Valheim API
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge
                          variant="outline"
                          className="mt-2 text-sm pointer-events-none"
                        >
                          {activeKeysCount}/{apiKeys.userPlan.allowedApiKeys}{" "}
                          Keys Used
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Active API keys / Total allowed keys</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      disabled={
                        activeKeysCount >= apiKeys.userPlan.allowedApiKeys
                      }
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Key
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-md">
                    <DialogHeader>
                      <DialogTitle>Create New API Key</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="keyName">Key Name</Label>
                        <Input
                          id="keyName"
                          placeholder="Enter a name for your API key"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={handleCreateKey}
                        disabled={!newKeyName || isCreating}
                        className="w-full"
                      >
                        {isCreating ? "Creating..." : "Create API Key"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="space-y-4">
                {apiKeys.keysData.length > 0 &&
                  apiKeys.keysData
                    .filter(
                      (k) =>
                        (k.status === "revoked" && showRevoked) ||
                        k.status === "active"
                    )
                    .map((key) => (
                      <div
                        key={key.$id}
                        className="flex items-center justify-between p-4 border rounded-lg gap-2 relative"
                      >
                        <div className="space-y-1 overflow-hidden w-full">
                          <div className="flex items-center space-x-2 overflow-hidden w-full justify-between sm:justify-normal">
                            <p className="text-sm sm:text-md font-medium truncate">
                              {key.name}
                            </p>
                            <Badge
                              variant={"secondary"}
                              className={`text-sm sm:text-md pointer-events-none ${
                                key.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {key.status}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm">
                              {key.key.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.key)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Created:{" "}
                            {new Date(key.created).toLocaleDateString()}
                          </p>
                        </div>

                        {key.status === "active" && (
                          <Button
                            className="absolute sm:relative right-4 bottom-4 sm:right-0 sm:bottom-0 flex items-center gap-2 bg-color-button-bg hover:bg-color-button-hover text-color-button-text"
                            size="icon"
                            onClick={() => handleRevokeKey(key.$id)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
              </div>
              {user.plan.toLowerCase() !== "pro" && <UpgradeCTA />}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Settings
