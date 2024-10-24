import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"

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
import { SigninValidation } from "@/lib/validation"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const navigate = useNavigate()

  const { mutateAsync: signInAccount } = useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
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
        <div className="max-w-md w-full bg-color-secondary-bg rounded-lg shadow-lg p-8">
          <h2 className="text-5xl font-semibold font-norse text-color-text-primary mb-2 text-center">
            Log in to your account
          </h2>

          <p className="text-xl font-norse text-color-text-tertiary mb-4 text-center">
            Welcome back! Please enter your details
          </p>

          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
                      className="bg-color-input-bg text-color-text-primary border-color-border focus:ring-color-focus focus:border-color-focus w-full rounded-md p-2"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-color-error" />
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
                      className="bg-color-input-bg text-color-text-primary border-color-border focus:ring-color-focus focus:border-color-focus w-full rounded-md p-2"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-color-error" />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-color-button-bg text-color-button-text font-semibold rounded-md hover:bg-color-button-hover transition-all duration-300"
            >
              {isUserLoading ? (
                <div className="text-center">Loading...</div>
              ) : (
                "Sign in"
              )}
            </Button>

            <p className="text-center text-sm text-color-text-tertiary">
              Don't have an account?
              <Link
                className="text-color-link hover:underline ml-1"
                to="/sign-up"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Form>
  )
}

export default SigninForm
