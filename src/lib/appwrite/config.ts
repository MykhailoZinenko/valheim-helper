import { Client, Account, Databases, OAuthProvider } from "appwrite"

export const appwriteConfig = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  userCollectionId: import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID,
  calculationCollectionId: import.meta.env
    .VITE_APPWRITE_CALCULATIONS_COLLECTION_ID,
  itemCollectionId: import.meta.env.VITE_APPWRITE_ITEM_COLLECTION_ID,
}

export const client = new Client()

client.setProject(appwriteConfig.projectId)
client.setEndpoint(appwriteConfig.url)

export const account = new Account(client)
export const databases = new Databases(client)

export { OAuthProvider }
