import { useQuery, useMutation } from "@tanstack/react-query"
import {
  createUserAccount,
  getCurrentUser,
  signInAccount,
  signOutAccount,
} from "../appwrite/api"
import { INewUser } from "@/types"
import { QUERY_KEYS } from "./queryKeys"
import { getAllItems, getItemById } from "../valheim-helper/api"

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
