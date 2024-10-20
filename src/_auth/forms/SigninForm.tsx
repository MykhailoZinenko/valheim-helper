import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'

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
import { SigninValidation } from '@/lib/validation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext()

  const navigate = useNavigate()

  const { mutateAsync: signInAccount } = useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
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
            Log in to your account
          </h2>

          <p className="text-lg text-gray-500 mb-6 text-center">
            Welcome back! Please enter your details
          </p>

          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
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
              {isUserLoading ? (
                <div className="text-center">Loading...</div>
              ) : (
                'Sign in'
              )}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Don't have an account?
              <Link
                className="text-indigo-600 hover:underline ml-1"
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
