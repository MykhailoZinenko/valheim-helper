import { ID, Query } from "appwrite"

import { AuthError, INewUser } from "@/types"
import { account, appwriteConfig, databases, OAuthProvider } from "./config"

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount)
      throw {
        type: "auth_error",
        message: "Failed to create account",
      } as AuthError

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
    })

    return { data: newUser, error: null }
  } catch (error: any) {
    console.error("Create account error:", error)

    // Handle Appwrite specific errors
    if (error?.code) {
      switch (error.code) {
        case 409: // User already exists
          return {
            data: null,
            error: {
              type: "auth_error",
              message: "An account with this email already exists",
            } as AuthError,
          }
        case 400: // Invalid email
          return {
            data: null,
            error: {
              type: "validation_error",
              message: "Please provide a valid email address",
            } as AuthError,
          }
        case 401:
          return {
            data: null,
            error: {
              type: "auth_error",
              message: "Invalid credentials",
            } as AuthError,
          }
        default:
          return {
            data: null,
            error: {
              type: "server_error",
              message: "Failed to create account. Please try again later",
            } as AuthError,
          }
      }
    }

    return {
      data: null,
      error: {
        type: "unknown_error",
        message: "An unexpected error occurred. Please try again",
      } as AuthError,
    }
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    )

    return { data: session, error: null }
  } catch (error: any) {
    console.error("Sign in error:", error)

    // Handle Appwrite specific errors
    if (error?.code) {
      switch (error.code) {
        case 401:
          return {
            data: null,
            error: {
              type: "auth_error",
              message: "Invalid email or password",
            } as AuthError,
          }
        case 429: // Too many attempts
          return {
            data: null,
            error: {
              type: "auth_error",
              message: "Too many login attempts. Please try again later",
            } as AuthError,
          }
        default:
          return {
            data: null,
            error: {
              type: "server_error",
              message: "Failed to sign in. Please try again later",
            } as AuthError,
          }
      }
    }

    return {
      data: null,
      error: {
        type: "unknown_error",
        message: "An unexpected error occurred. Please try again",
      } as AuthError,
    }
  }
}

export async function signInWithGoogle() {
  try {
    const session = await account.createOAuth2Session(
      OAuthProvider.Google,
      "http://localhost:5173/success",
      "http://localhost:5173/sign-in"
    )
    return { data: session, error: null }
  } catch (error: any) {
    console.error("Google sign in error:", error)
    return {
      data: null,
      error: {
        type: "auth_error",
        message: "Failed to sign in with Google. Please try again",
      } as AuthError,
    }
  }
}

export async function saveUserToDB(user: {
  accountId: string
  email: string
  name: string
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.log(error)
  }
}

// Add this function to handle the OAuth user creation in DB
export async function saveOAuthUserToDB() {
  try {
    const currentAccount = await account.get()

    // Check if user already exists in database
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (users.documents.length > 0) {
      return users.documents[0] // User already exists
    }

    // Create new user in database
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: currentAccount.$id,
        email: currentAccount.email,
        name: currentAccount.name,
      }
    )

    return newUser
  } catch (error) {
    console.log(error)
    throw error
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) throw Error

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentUser) throw Error

    return currentUser.documents[0]
  } catch (error) {
    console.log(error)
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current")

    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getUserCalculations(userId: string, name: string) {
  try {
    const userCalculations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.calculationCollectionId,
      [
        Query.equal("creator", userId),
        Query.orderDesc("$createdAt"),
        Query.equal("type", name),
      ]
    )

    console.log("api call", userId, userCalculations)

    if (!userCalculations) throw Error

    return userCalculations
  } catch (error) {
    console.log(error)
  }
}

export async function postCalculation(
  userId: string,
  type: string,
  calculation: any
) {
  try {
    if (!["food", "resource"].includes(type)) {
      throw new Error("Invalid calculation type. Must be 'food' or 'resource'.")
    }

    const itemIds = await Promise.all(
      calculation.map(async (item: any) => {
        const itemDocument = await databases.createDocument(
          appwriteConfig.databaseId,
          appwriteConfig.itemCollectionId,
          ID.unique(),
          {
            name: item.name,
            quantity: item.quantity,
          }
        )
        return itemDocument.$id
      })
    )

    const calculationDocument = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.calculationCollectionId,
      ID.unique(),
      {
        creator: userId,
        type: type,
        items: itemIds,
      }
    )

    console.log("Calculation created successfully:", calculationDocument)
    return calculationDocument
  } catch (error) {
    console.error("Error creating calculation:", error)
    throw error
  }
}

export async function deleteCalculation(calculationId: string) {
  try {
    console.log(
      appwriteConfig.databaseId,
      appwriteConfig.calculationCollectionId,
      calculationId
    )
    const response = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.calculationCollectionId,
      calculationId
    )
    console.log("Calculation deleted successfully:", response)
    return response
  } catch (error) {
    console.error("Error deleting calculation:", error)
    throw error
  }
}
