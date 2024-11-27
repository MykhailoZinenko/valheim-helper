import { useEffect, useState } from "react"
import ItemsCombobox from "@/components/shared/ItemsCombobox"
import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"
import {
  useDeleteCalculation,
  useGetItems,
  useGetUserCalculations,
  usePostCalculation,
} from "@/lib/react-query/queriesAndMutations"
import {
  MinusIcon,
  PlusIcon,
  Calculator as CalcIcon,
  History,
  Save,
  RefreshCw,
  Trash2,
  InfoIcon,
} from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { IRecipeItem, IFood } from "@/types"
import { StarFilledIcon } from "@radix-ui/react-icons"

const Calculator = ({
  name,
  data,
  isCompact = false,
}: {
  name: "food" | "resource"
  data: IRecipeItem[]
  isCompact?: boolean
}) => {
  // State management
  const [autoDelete, setAutoDelete] = useState(
    JSON.parse(localStorage.getItem(`auto-delete`) ?? "false")
  )
  const [itemNames, setItemNames] = useState<
    { name: string; quantity: number }[]
  >(JSON.parse(localStorage.getItem(`${name}-calculator-item-names`) ?? "[]"))

  const [materials, setMaterials] = useState<
    { name: string; quantity: number }[]
  >(JSON.parse(localStorage.getItem(`${name}-calculator-materials`) ?? "[]"))

  const [workbenches, setWorkbenches] = useState<
    { name: string; level: number }[]
  >(JSON.parse(localStorage.getItem(`${name}-calculator-workbenches`) ?? "[]"))

  const { user } = useUserContext()
  const {
    data: items,
    isPending: isItemsPending,
    isError: isItemsError,
  } = useGetItems()

  const {
    data: calculations,
    isPending: isCalculationsPending,
    isError: isCalculationsError,
  } = useGetUserCalculations(user.id, name)

  const { mutateAsync: postCalculation } = usePostCalculation()
  const { mutateAsync: deleteCalculation } = useDeleteCalculation()

  // Effect for materials calculation
  useEffect(() => {
    if (!data || !items) return

    setMaterials(() => {
      const materials: { name: string; quantity: number }[] = []

      if (itemNames.length > 0) {
        itemNames.forEach((item) => {
          const foundItem = data.find((i: IRecipeItem) => i.name === item.name)

          if (foundItem && foundItem.recipe) {
            console.log("recipe", foundItem.recipe)
            Object.entries(foundItem.recipe.materials).forEach(
              ([key, value]) => {
                console.log(key, value)
                const materialItem = items.items.find((item) => item.id === key)
                const material = materials.find(
                  (material) => material.name === (materialItem?.name || key)
                )

                console.log(materials, material)

                if (material) {
                  material.quantity += (value as number) * item.quantity
                } else {
                  materials.push({
                    name: materialItem?.name || key,
                    quantity: (value as number) * item.quantity,
                  })
                }
              }
            )
          } else {
            materials.push({
              name: item.name,
              quantity: item.quantity,
            })
          }
        })
      }

      // Update localStorage
      localStorage.setItem(
        `${name}-calculator-item-names`,
        JSON.stringify(itemNames)
      )
      localStorage.setItem(
        `${name}-calculator-materials`,
        JSON.stringify(materials)
      )

      return materials
    })

    setWorkbenches(() => {
      const workbenches: { name: string; level: number }[] = []

      if (itemNames.length > 0) {
        itemNames.forEach((item) => {
          const foundItem = data.find((i: IRecipeItem) => i.name === item.name)

          if (foundItem && foundItem.recipe?.source) {
            const workbenchItem = items.items.find(
              (item) => item.id === foundItem.recipe.source.station
            )
            const workbench = workbenches.find(
              (workbench) =>
                workbench.name ===
                (workbenchItem?.name || foundItem.recipe.source.station)
            )

            if (workbench) {
              workbench.level = Math.max(
                workbench.level,
                foundItem.recipe.source.level
              )
            } else {
              workbenches.push({
                name: workbenchItem?.name || foundItem.recipe.source.station,
                level: foundItem.recipe.source.level,
              })
            }
          }
        })
      }

      localStorage.setItem(
        `${name}-calculator-workbenches`,
        JSON.stringify(workbenches)
      )

      return workbenches
    })
  }, [itemNames, data, items])

  // Handler functions
  const handleQuantityChange = (itemName: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setItemNames((prev) => prev.filter((i) => i.name !== itemName))
      return
    }

    setItemNames((prev) =>
      prev.map((i) =>
        i.name === itemName ? { ...i, quantity: newQuantity } : i
      )
    )
  }

  const handleSave = async () => {
    if (calculations?.documents && calculations?.documents.length >= 10) {
      if (autoDelete) {
        console.log(calculations?.documents)
        await deleteCalculation(calculations.documents.at(-1)!.$id)
      } else {
        toast({
          title: "Error",
          description: "Cannot save more than 10 calculations",
          variant: "destructive",
        })
        return
      }
    }
    try {
      const result = await postCalculation({
        userId: user.id,
        type: name,
        calculation: itemNames,
      })

      if (result) {
        toast({
          title: "Success",
          description: "Calculation saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save calculation",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (calculationId: string) => {
    try {
      const result = await deleteCalculation(calculationId)

      if (result) {
        toast({
          title: "Success",
          description: "Calculation deleted successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete calculation",
        variant: "destructive",
      })
    }
  }

  // Loading and error states
  if (
    isItemsPending ||
    isItemsError ||
    isCalculationsError ||
    isCalculationsPending ||
    !calculations
  ) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader size="lg" />
      </div>
    )
  }

  return (
    <div className="relative w-full my-8 animate-fade-in">
      {/* Viking pattern background */}
      <div className="absolute inset-0 bg-[url('/norse-pattern.svg')] opacity-5" />

      {/* Main content */}
      <div className="relative z-10 space-y-8">
        {/* Header section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
            <CalcIcon className="w-8 h-8 text-accent animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-r from-border to-transparent" />
          </div>

          <h2 className="text-4xl font-norse font-bold uppercase tracking-wide">
            {name} Calculator
          </h2>
        </div>

        {/* Calculator section */}
        <div className="max-w-4xl mx-auto p-6 bg-color-primary-bg/50 backdrop-blur-sm border-2 border-accent/10 rounded-lg">
          {/* Search input */}
          <div className="mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000" />
              <div className="relative">
                <ItemsCombobox data={data} setItems={setItemNames} />
              </div>
            </div>
          </div>

          {/* Items and Materials Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Selected Items */}
            <div className="space-y-4">
              <h3 className="text-2xl font-norse font-bold mb-4 flex items-center gap-2">
                <span>Selected Items</span>
              </h3>

              {itemNames.length === 0 && (
                <p className="text-color-text-secondary">
                  Use the search above to add items
                </p>
              )}

              {itemNames.map((item) =>
                item.quantity <= 0 ? null : (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 p-2 px-4 bg-color-secondary-bg/50 rounded-lg border border-accent/10 hover:border-accent/20 transition-all duration-300"
                  >
                    <img
                      src={
                        data.find((f: IRecipeItem) => f.name === item.name)
                          ?.icon
                      }
                      height={32}
                      width={32}
                      className="rounded-md"
                    />
                    <span className="font-medium text-color-text-primary md:whitespace-nowrap overflow-hidden text-ellipsis">
                      {item.name}
                    </span>
                    <div className="flex items-center gap-2 ml-auto">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-accent/10"
                        onClick={() =>
                          handleQuantityChange(item.name, item.quantity - 1)
                        }
                      >
                        <MinusIcon className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        min={0}
                        className="w-16 text-center"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.name,
                            Number(e.target.value)
                          )
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        className="hover:bg-accent/10"
                        onClick={() =>
                          handleQuantityChange(item.name, item.quantity + 1)
                        }
                      >
                        <PlusIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* Required Materials */}
            <div className="space-y-4">
              <h3 className="text-2xl font-norse font-bold mb-4">
                Required Workbenches
              </h3>
              {workbenches.map((workbench) =>
                workbench.level <= 0 ? null : (
                  <div
                    key={workbench.name}
                    className="flex items-center gap-3 p-2 px-4 bg-color-secondary-bg/50 rounded-lg border border-accent/10 transition-all duration-300 h-[54px]"
                  >
                    <img
                      src={
                        items.items.find((f) => f.name === workbench.name)?.icon
                      }
                      height={32}
                      width={32}
                      className="rounded-md"
                    />
                    <span className="font-medium text-color-text-primary">
                      {workbench.name}
                    </span>
                    <span className="ml-auto font-bold text-accent flex gap-1 items-center">
                      {workbench.level}
                      <StarFilledIcon />
                    </span>
                  </div>
                )
              )}
              <h3 className="text-2xl font-norse font-bold mb-4">
                Required Materials
              </h3>
              {materials.map((material) =>
                material.quantity <= 0 ? null : (
                  <div
                    key={material.name}
                    className="flex items-center gap-3 p-2 px-4 bg-color-secondary-bg/50 rounded-lg border border-accent/10 transition-all duration-300 h-[54px]"
                  >
                    <img
                      src={
                        items.items.find((f) => f.name === material.name)?.icon
                      }
                      height={32}
                      width={32}
                      className="rounded-md"
                    />
                    <span className="font-medium text-color-text-primary">
                      {material.name}
                    </span>
                    <span className="ml-auto font-bold text-accent">
                      {material.quantity}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-8">
            <Button
              onClick={() => setItemNames([])}
              className="flex items-center gap-2 hover:bg-accent/20"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        </div>

        {/* History section */}
        <div className="max-w-4xl mx-auto mt-12 p-6 bg-color-primary-bg/50 backdrop-blur-sm border-2 border-accent/10 rounded-lg">
          <div className="flex items-center gap-4 mb-6">
            <History className="w-6 h-6 text-accent mb-[5px]" />
            <h2 className="text-2xl font-norse font-bold">
              Calculation History
            </h2>
            <div className="flex items-center space-x-2 mb-1 ml-auto">
              <Checkbox
                id="auto-delete"
                onCheckedChange={() => {
                  setAutoDelete(!autoDelete)
                  localStorage.setItem(
                    `auto-delete`,
                    JSON.stringify(!autoDelete)
                  )
                }}
              />
              <label
                htmlFor="auto-delete"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 hidden sm:block"
              >
                Auto delete oldest calculation
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
                      <p>Auto delete oldest calculation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            {calculations.documents.map((calculation, index) => (
              <div
                key={calculation.$id}
                className="p-4 bg-color-secondary-bg/50 rounded-lg border border-accent/10 transition-all duration-300"
              >
                <h3 className="text-lg font-medium mb-3 text-color-text-secondary">
                  #{index + 1} -{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }).format(new Date(calculation.$createdAt))}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {calculation.items.map((item: any) => (
                    <div
                      key={item.$id}
                      className="flex items-center gap-2 p-2 px-4 bg-color-primary-bg/50 rounded-lg hover:bg-accent/5 transition-colors"
                    >
                      <img
                        src={
                          items.items.find((f) => f.name === item.name)?.icon
                        }
                        height={32}
                        width={32}
                        className="rounded-md"
                      />
                      <span className="font-medium text-color-text-primary text-nowrap overflow-hidden text-ellipsis">
                        {item.name}
                      </span>
                      <span className="ml-auto font-bold text-accent">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    onClick={() =>
                      setItemNames(
                        calculation.items.map((i: any) => ({
                          name: i.name,
                          quantity: i.quantity,
                        }))
                      )
                    }
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Load
                  </Button>
                  <Button
                    onClick={() => handleDelete(calculation.$id)}
                    className="flex items-center gap-2 bg-color-button-bg hover:bg-color-button-hover text-color-button-text"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calculator
