import { getCurrentUser } from "@/lib/appwrite/api"
import {
  useCreateDeveloperKey,
  useRevokeDeveloperKey,
} from "@/lib/react-query/queriesAndMutations"
import {
  createDeveloperApiKey,
  getDeveloperApiKeys,
  revokeDeveloperApiKey,
} from "@/lib/valheim-helper/api"
import { IContextType, IUser } from "@/types"
import { createContext, useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"

interface ApiKey {
  $id: string
  key: string
  name: string
  created: string
  status: "active" | "revoked"
  revokedAt?: string
}

const INITIAL_USER = {
  id: "",
  name: "",
  email: "",
  apiKeys: { keysData: [], userPlan: {} } as {
    keysData: ApiKey[]
    userPlan: any
  },
  plan: "",
}

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  createApiKey: async () => null as ApiKey | null,
  revokeApiKey: async () => {},
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser>(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const { mutateAsync: createDeveloperApiKey } = useCreateDeveloperKey()
  const { mutateAsync: revokeDeveloperApiKey } = useRevokeDeveloperKey()

  const checkAuthUser = async () => {
    try {
      const currentAccount = await getCurrentUser()

      if (currentAccount) {
        // Get existing API keys if any
        const existingKeys = await getDeveloperApiKeys(currentAccount.$id)

        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          email: currentAccount.email,
          apiKeys: existingKeys,
          plan: currentAccount.plan,
        })

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

  const createApiKey = async (name: string) => {
    try {
      if (!user.id) return null

      const newKey = await createDeveloperApiKey({ userId: user.id, name })
      setUser((prev) => ({
        ...prev,
        apiKeys: {
          keysData: [...prev.apiKeys.keysData, newKey],
          userPlan: prev.apiKeys.userPlan,
        },
      }))

      return newKey
    } catch (error) {
      console.error("Failed to create API key:", error)
      return null
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      if (!user.id) return

      await revokeDeveloperApiKey({ userId: user.id, keyId })
      setUser((prev) => ({
        ...prev,
        apiKeys: {
          keysData: prev.apiKeys.keysData.map((key) =>
            key.$id === keyId
              ? {
                  ...key,
                  status: "revoked" as const,
                  revokedAt: new Date().toISOString(),
                }
              : key
          ),
          userPlan: prev.apiKeys.userPlan,
        },
      }))
    } catch (error) {
      console.error("Failed to revoke API key:", error)
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
    createApiKey,
    revokeApiKey,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
export const useUserContext = () => useContext(AuthContext)
