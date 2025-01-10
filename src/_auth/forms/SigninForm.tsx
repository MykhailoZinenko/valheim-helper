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
import { signInWithGoogle } from "@/lib/appwrite/api"
import GoogleLogo from "@/components/ui/GoogleLogo"

const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: signInAccount } = useSignInAccount()

  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    const { error } = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (error) {
      return toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error.message,
      })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()
      navigate("/", { replace: true })
    } else {
      return toast({
        variant: "destructive",
        title: "Sign in failed",
        description: "Please try again later",
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle()

      if (error) {
        toast({
          variant: "destructive",
          title: "Google Sign In Failed",
          description: error.message,
        })
      }
      // Successful case will redirect to Google
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to initialize Google sign in",
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-color-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-color-secondary-bg text-color-text-tertiary">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-2 px-4 border border-color-border text-color-text-primary font-semibold rounded-md hover:bg-color-button-hover transition-all duration-300"
            onClick={handleGoogleSignIn}
          >
            <GoogleLogo />
            Sign in with Google
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default SigninForm
