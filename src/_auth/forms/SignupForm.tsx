import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { SignupValidation } from '@/lib/validation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import {
  useCreateUserAccount,
  useSignInAccount
} from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

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
      name: '',
      username: '',
      email: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)

    if (!newUser) {
      return toast({
        title: 'Sign up failed. Please try again.'
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password
    })

    if (!session) {
      return toast({
        title: 'Sign up failed. Please try again.'
      })
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate('/')
    } else {
      return toast({
        title: 'Sign up failed. Please try again.'
      })
    }
  }

  return (
    <Form {...form}>
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4 text-center">
            Create a new account
          </h2>

          <p className="text-lg text-gray-500 mb-6 text-center">
            To use Valheim Helper, please enter your account details
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-700">Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-md p-2"
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-700">
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-md p-2"
                      placeholder="Enter your username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-700">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-md p-2"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-gray-700">
                    Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-md p-2"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-all duration-300"
            >
              {isCreatingAccount ? (
                <div className="flex items-center justify-center">
                  Loading...
                </div>
              ) : (
                'Sign up'
              )}
            </Button>
            <p className="text-center text-sm text-gray-500">
              Already have an account?
              <Link
                className="text-indigo-600 hover:underline ml-1"
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
