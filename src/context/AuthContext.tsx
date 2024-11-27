import { getCurrentUser } from "@/lib/appwrite/api"
import {
  createDeveloperApiKey,
  getDeveloperApiKey,
} from "@/lib/valheim-helper/api"
import { IContextType, IUser } from "@/types"
import { createContext, useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const INITIAL_USER = {
  id: "",
  name: "",
  email: "",
  apiKey: "",
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  apiKey: null,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  createApiKey: async () => null as string | null,
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [apiKey, setApiKey] = useState<string | null>(null)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser()

      if (currentAccount) {
        // Get existing API key if any
        const existingKey = await getDeveloperApiKey(currentAccount.$id)

        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          email: currentAccount.email,
          apiKey: existingKey || undefined,
        })

        setApiKey(existingKey)
        setIsAuthenticated(true)

        return true
      }

      return false
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const createApiKey = async () => {
    try {
      if (!user.id) return null

      const newKey = await createDeveloperApiKey(user.id)
      setApiKey(newKey)
      setUser((prev) => ({ ...prev, apiKey: newKey }))

      return newKey
    } catch (error) {
      console.error("Failed to create API key:", error)
      return null
    }
  }

  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    ) {
      if (pathname !== "/sign-up") {
        navigate("/sign-in")
      }
    }

    checkAuthUser()
  }, [])

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    apiKey,
    createApiKey,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
export const useUserContext = () => useContext(AuthContext)
