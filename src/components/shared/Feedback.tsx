import { useState } from "react"
import {
  MessageCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SendIcon,
} from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"
import { useUserContext } from "@/context/AuthContext"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { FeedbackValidation } from "@/lib/validation"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form"
import { Textarea } from "../ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { valheimHelperApiConfig } from "@/lib/valheim-helper/config"

const ISSUE_TYPES = ["question", "inaccuracy", "bug", "request"]

const Feedback = () => {
  const { user } = useUserContext()
  const [step, setStep] = useState(1)
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FeedbackValidation>>({
    resolver: zodResolver(FeedbackValidation),
    defaultValues: {
      issueType: "",
      description: "",
    },
  })

  async function onSubmit(values: z.infer<typeof FeedbackValidation>) {
    if (!user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(
        `${valheimHelperApiConfig.url}/api/feedback`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            issueType: values.issueType,
            description: values.description,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to submit feedback")
      }

      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      })

      form.reset()
      setStep(1)

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    const issueType = form.getValues("issueType")
    if (issueType) {
      setStep(2)
      setShowError(false)
    } else {
      setShowError(true)
      form.setError("issueType", {
        type: "manual",
        message: "Please select an issue type",
      })
    }
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          size="icon"
          className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover ml-2 xl:ml-0"
        >
          <MessageCircleIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[300px] p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
            <div className="p-4">
              {step === 1 ? (
                <FormField
                  control={form.control}
                  name="issueType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-sm text-color-text-secondary">
                        Issue type
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          {ISSUE_TYPES.map((type) => (
                            <FormItem
                              key={type}
                              className="flex items-center space-x-3 space-y-0"
                            >
                              <FormControl>
                                <RadioGroupItem value={type} />
                              </FormControl>
                              <FormLabel className="font-normal text-color-text-primary">
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      {showError && <FormMessage />}
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-color-text-secondary">
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide details..."
                          className="min-h-[100px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-color-error" />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="flex justify-between items-center border-t p-2">
              {step === 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setStep(1)}
                  className="h-8 w-8"
                >
                  <ArrowLeftIcon className="h-4 w-4" />
                </Button>
              )}
              <div className="ml-auto">
                {step === 1 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    size="icon"
                    className="h-8 w-8 bg-color-button-bg text-color-button-text hover:bg-color-button-hover"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isSubmitting}
                    className="h-8 w-8 bg-color-button-bg text-color-button-text hover:bg-color-button-hover"
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}

export default Feedback
