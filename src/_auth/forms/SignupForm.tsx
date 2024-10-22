import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()

  const navigate = useNavigate()

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount()

  const { mutateAsync: signInAccount } = useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)

    if (!newUser) {
      return toast({
        title: "Sign up failed. Please try again.",
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      return toast({
        title: "Sign up failed. Please try again.",
      })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate("/")
    } else {
      return toast({
        title: "Sign up failed. Please try again.",
      })
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8">
        <div className="max-w-md w-full bg-color-secondary-bg rounded-lg shadow-md p-8">
          <h2 className="text-5xl font-semibold font-norse text-color-text-primary mb-2 text-center">
            Create a new account
          </h2>

          <p className="text-xl font-norse text-color-text-tertiary mb-4 text-center">
            To use Valheim Helper, please enter your account details
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-color-text-secondary">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="bg-color-input-bg text-color-text-primary border-color-border focus:ring-color-focus focus:border-color-border w-full rounded-md p-2"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-color-text-tertiary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-color-text-secondary">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="bg-color-input-bg text-color-text-primary border-color-border focus:ring-color-focus focus:border-color-border w-full rounded-md p-2"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-color-text-tertiary" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-color-text-secondary">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="bg-color-input-bg text-color-text-primary border-color-border focus:ring-color-focus focus:border-color-border w-full rounded-md p-2"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-color-text-tertiary" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-color-button-bg text-color-button-text font-semibold rounded-md hover:bg-color-button-hover transition-all duration-300"
            >
              {isCreatingAccount ? (
                <div className="flex items-center justify-center">
                  Loading...
                </div>
              ) : (
                "Sign up"
              )}
            </Button>
            <p className="text-center text-sm text-color-text-tertiary">
              Already have an account?
              <Link
                className="text-color-link hover:underline ml-1"
                to="/sign-in"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Form>
  )
}

export default SignupForm
