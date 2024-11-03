import { ID, Query } from "appwrite"

import { INewUser } from "@/types"
import { account, appwriteConfig, databases } from "./config"

export async function createUserAccount(user: INewUser) {
  try {
    console.log(user)

    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    )

    if (!newAccount) throw Error

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
    })

    return newUser
  } catch (error) {
    console.log(error)
    return error
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

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    )

    return session
  } catch (error) {
    console.log(error)
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
      [Query.equal("creator", userId), Query.orderDesc("$createdAt"), Query.equal("type", name)],
      
    )

    console.log("api call", userId, userCalculations)

    if (!userCalculations) throw Error

    return userCalculations
  } catch (error) {
    console.log(error)
  }
} 

export async function postCalculation(userId: string, type: string, calculation: any) {
    try {
        if (!['food', 'resource'].includes(type)) {
            throw new Error("Invalid calculation type. Must be 'food' or 'resource'.");
        }

        const itemIds = await Promise.all(calculation.map(async (item: any) => {
            const itemDocument = await databases.createDocument(
                appwriteConfig.databaseId,               
                appwriteConfig.itemCollectionId,       
                ID.unique(),                    
                {
                    name: item.name,
                    quantity: item.quantity
                }
            );
            return itemDocument.$id; 
        }));

        const calculationDocument = await databases.createDocument(
            appwriteConfig.databaseId,                    
            appwriteConfig.calculationCollectionId,     
            ID.unique(),                         
            {
                creator: userId,                    
                type: type,                     
                items: itemIds                  
            }
        );

        console.log("Calculation created successfully:", calculationDocument);
        return calculationDocument;
    } catch (error) {
        console.error("Error creating calculation:", error);
        throw error;
    }
}

export async function deleteCalculation(calculationId: string) {
  try {
      console.log(appwriteConfig.databaseId, appwriteConfig.calculationCollectionId, calculationId)
        const response = await databases.deleteDocument(
            appwriteConfig.databaseId,                    
            appwriteConfig.calculationCollectionId,     
            calculationId
        );
        console.log("Calculation deleted successfully:", response);
        return response;
    } catch (error) {
        console.error("Error deleting calculation:", error);
        throw error;
    }
}
