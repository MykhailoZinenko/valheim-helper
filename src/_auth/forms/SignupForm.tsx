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
import { SignupValidation } from "@/lib/validation"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { signInWithGoogle } from "@/lib/appwrite/api"
import GoogleLogo from "@/components/ui/GoogleLogo"

const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
    useCreateUserAccount()

  const { mutateAsync: signInAccount } = useSignInAccount()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const { data: newUser, error: createError } =
      await createUserAccount(values)

    if (createError) {
      return toast({
        variant: "destructive",
        title: "Account Creation Failed",
        description: createError.message,
        duration: 5000,
      })
    }

    if (!newUser) {
      return toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "Something went wrong. Please try again.",
        duration: 5000,
      })
    }

    const { error: signInError } = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (signInError) {
      return toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: signInError.message,
        duration: 5000,
      })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()
      navigate("/")
    } else {
      return toast({
        variant: "destructive",
        title: "Sign up failed",
        description: "Please try signing in with your new account.",
        duration: 5000,
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await signInWithGoogle()

      if (error) {
        toast({
          variant: "destructive",
          title: "Google Sign Up Failed",
          description: error.message,
          duration: 5000,
        })
      }
      // Successful case will redirect to Google
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to initialize Google sign up",
        duration: 5000,
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
                  <FormMessage className="text-color-error" />
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
                      className="bg-color-input-bg text-color-text-primary border-color-border focus:ring-color-focus focus:border-color-border w-full rounded-md p-2"
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
              disabled={isCreatingAccount}
            >
              {isCreatingAccount ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </div>
              ) : (
                "Sign up"
              )}
            </Button>

            <p className="text-center text-sm text-color-text-tertiary">
              Already have an account?{" "}
              <Link className="text-color-link hover:underline" to="/sign-in">
                Log in
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
            Sign up with Google
          </Button>
        </div>
      </div>
    </Form>
  )
}

export default SignupForm
