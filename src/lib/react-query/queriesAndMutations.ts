import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  createUserAccount,
  deleteCalculation,
  getCurrentUser,
  getUserCalculations,
  postCalculation,
  signInAccount,
  signOutAccount,
} from "../appwrite/api"
import { INewUser } from "@/types"
import { QUERY_KEYS } from "./queryKeys"
import { getAllBiomes, getAllFood, getAllItems, getCalculatorItems, getItemById } from "../valheim-helper/api"

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
  })
}

export const useGetItems = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ITEMS],
    queryFn: getAllItems,
  })
}

export const useGetItemById = (itemId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ITEM_BY_ID, itemId],
    queryFn: () => getItemById(itemId),
    enabled: !!itemId,
  })
}

export const useGetItemByIdMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (itemId: string) => {
      const cachedItem = queryClient.getQueryData([QUERY_KEYS.GET_ITEM_BY_ID, itemId])

      console.log("here")
      
      if (cachedItem) {
        return cachedItem
      }

      console.log("Fetching item...")

      const fetchedItem = await getItemById(itemId)

      if (fetchedItem) {
        queryClient.setQueryData([QUERY_KEYS.GET_ITEM_BY_ID, itemId], fetchedItem)
        return fetchedItem
      }

      throw new Error("Item not found")
    }, 
  })
}

export const useGetBiomes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_BIOMES],
    queryFn: getAllBiomes,
  })
}

export const useGetFood = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FOOD],
    queryFn: getAllFood,
  })
}

export const useGetUserCalculations = (userId: string, name: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_CALCULATIONS],
    queryFn: () => getUserCalculations(userId, name),
    enabled: !!userId
  })
}

export const usePostCalculation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, type, calculation } : { userId: string, type: string, calculation: any}) => postCalculation(userId, type, calculation),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CALCULATIONS],
      })
    }
  })
}

export const useDeleteCalculation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (calculationId: string) => deleteCalculation(calculationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_CALCULATIONS],
      })
    }
  })
}

export const useGetCalculatorItems = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CALCULATOR_ITEMS],
    queryFn: () => getCalculatorItems(),
  })
}