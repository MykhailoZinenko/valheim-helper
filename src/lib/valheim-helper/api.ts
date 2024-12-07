import {
  IBiome,
  IItem,
  Biome,
  IResponse,
  IBiomeExtended,
  GameObject,
  IItemCompact,
  Resource,
  IItemFull,
  ApiKey,
  Food,
} from "@/types"
import { valheimHelperApiConfig } from "./config"
import { account } from "../appwrite/config"

const API_URL = valheimHelperApiConfig.url

let appToken: string | null = null
let expires: number | null = null

async function getAppToken(): Promise<string | null> {
  if (!appToken || (expires && Date.now() > expires)) {
    // Get current Appwrite session
    const jwt = await account.createJWT()

    // Exchange it for our app token
    const response = await fetch(`${API_URL}/api/auth/validate-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ appwriteJWT: jwt.jwt }),
    })

    if (!response.ok) {
      throw new Error("Failed to get app token")
    }

    const data = await response.json()
    appToken = data.token
    expires = data.expires
  }

  return appToken
}

export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
) {
  console.log(endpoint)
  const token = await getAppToken()

  return fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
}

export async function createDeveloperApiKey(
  userId: string,
  name: string
): Promise<ApiKey> {
  const response = await fetch(`${API_URL}/api/developer/keys`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, name }),
  })

  if (!response.ok) {
    throw new Error("Failed to create API key")
  }

  return await response.json()
}

export async function getDeveloperApiKeys(
  userId: string
): Promise<{ keysData: ApiKey[]; userPlan: any }> {
  const response = await fetch(`${API_URL}/api/developer/keys`, {
    headers: {
      Authorization: `User ${userId}`,
    },
  })

  if (!response.ok) {
    if (response.status === 404) {
      return { keysData: [], userPlan: {} } as {
        keysData: ApiKey[]
        userPlan: any
      }
    }
    throw new Error("Failed to get API keys")
  }

  return await response.json()
}

export async function revokeDeveloperApiKey(
  userId: string,
  keyId: string
): Promise<void> {
  const response = await fetch(
    `${API_URL}/api/developer/keys/${keyId}/revoke`,
    {
      method: "POST",
      headers: {
        Authorization: `User ${userId}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to revoke API key")
  }
}

export const getAllItems: () => Promise<
  IResponse<IItem<IItemCompact>>
> = async () => {
  try {
    console.log(API_URL)
    const response = await fetchWithAuth("/api/items")

    if (!response.ok) {
      throw new Error("Failed to fetch items")
    }

    const data = await response.json()

    if (!data) {
      throw new Error("No items found")
    }

    console.log(data)

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getItemById: (
  itemId: string
) => Promise<IItemFull<GameObject>> = async (itemId: string) => {
  try {
    const response = await fetchWithAuth(`/api/items/${itemId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch item")
    }

    const data = await response.json()

    if (!data) {
      throw new Error("No item found")
    }

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllBiomes: () => Promise<
  IResponse<IItem<IBiome>>
> = async () => {
  try {
    const response = await fetchWithAuth(`/api/biomes`)

    if (!response.ok) {
      throw new Error("Failed to fetch biomes")
    }

    const data = await response.json()

    if (!data) {
      throw new Error("No biomes found")
    }

    console.log(data)

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getBiomeById: (biomeId: Biome) => Promise<IBiomeExtended> = async (
  biomeId: Biome
) => {
  try {
    const response = await fetchWithAuth(`/api/biomes/${biomeId}`)

    if (!response.ok) {
      throw new Error("Failed to fetch biome")
    }

    const data = await response.json()

    if (!data) {
      throw new Error("No biome found")
    }

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getAllFood: () => Promise<
  IResponse<IItemFull<IItemCompact & { Food: Food }>>
> = async () => {
  try {
    const response = await fetchWithAuth(`/api/food`)

    if (!response.ok) {
      throw new Error("Failed to fetch food")
    }

    const data = await response.json()

    if (!data) {
      throw new Error("No food found")
    }

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}

export const getCalculatorItems: () => Promise<
  IResponse<IItemFull<IItemCompact>>
> = async () => {
  try {
    const response = await fetchWithAuth(`/api/items/calculator`)

    if (!response.ok) {
      throw new Error("Failed to fetch calculator items")
    }

    const data = await response.json()

    if (!data) {
      throw new Error("No calculator items found")
    }

    console.log("c_data", data)

    return data
  } catch (error) {
    console.log(error)
    return error
  }
}
