import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { account } from "@/lib/appwrite/config"
import { saveOAuthUserToDB } from "@/lib/appwrite/api"
import { Loader2 } from "lucide-react"

export default function CallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const session = await account.getSession("current")
        if (session) {
          await saveOAuthUserToDB()
          navigate("/")
        }
      } catch (error) {
        console.error("OAuth callback error:", error)
        navigate("/sign-in")
      }
    }

    handleOAuthCallback()
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-color-primary-bg">
      <div className="max-w-md w-full bg-color-secondary-bg rounded-lg shadow-lg p-8">
        <h2 className="text-5xl font-semibold font-norse text-color-text-primary mb-2 text-center">
          Processing
        </h2>

        <p className="text-xl font-norse text-color-text-tertiary mb-8 text-center">
          Please wait while we complete your authentication
        </p>

        <div className="flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-color-text-primary" />
        </div>

        <p className="text-sm text-color-text-tertiary text-center mt-8">
          You will be redirected automatically
        </p>
      </div>
    </div>
  )
}
