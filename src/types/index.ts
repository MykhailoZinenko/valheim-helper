export type IContextType = {
  user: IUser
  isLoading: boolean
  setUser: React.Dispatch<React.SetStateAction<IUser>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthUser: () => Promise<boolean>
}

export type INavLink = {
  imgURL: string
  route: string
  label: string
}

export type IUpdateUser = {
  userId: string
  name: string
}

export type IUser = {
  id: string
  name: string
  email: string
}

export type INewUser = {
  name: string
  email: string
  password: string
}

export type IItem = {
  id: string
  name: string
  originalName: string
  type: string
  icon: string
  tier: number
}
