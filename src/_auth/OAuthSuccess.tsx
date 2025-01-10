import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useUserContext } from "@/context/AuthContext"
import { saveOAuthUserToDB } from "@/lib/appwrite/api"

const OAuthSuccess = () => {
  const navigate = useNavigate()
  const { checkAuthUser } = useUserContext()

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        await saveOAuthUserToDB()
        const isLoggedIn = await checkAuthUser()

        if (isLoggedIn) {
          navigate("/")
        } else {
          navigate("/sign-in")
        }
      } catch (error) {
        console.error("OAuth success handling failed:", error)
        navigate("/sign-in")
      }
    }

    handleOAuthSuccess()
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-color-text-primary">Processing your sign in...</p>
    </div>
  )
}

export default OAuthSuccess
