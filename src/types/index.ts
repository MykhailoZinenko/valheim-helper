export interface IContextType {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  apiKey: string | null; // Add this
  setUser: (user: IUser) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  checkAuthUser: () => Promise<boolean>;
  createApiKey: () => Promise<string | null>; // Add this
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
  apiKey?: string
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
  type: ItemType
  icon: string
  tier: number
  biomes: Biome[]
  group: ItemGroup
  station: StationType
}

type Recipe = any

type FoodStats = {
    health: number
    stamina: number
    eitr?: number
    duration: number
    regen: number
}

export type IFullItem = {item: any, recipe: Recipe}
export type IRecipeItem = IItem & { recipe: Recipe }
export type IFood = IRecipeItem & { stats: FoodStats }

export type IBiome = {
  name: Biome
  description: string
  bosses: Partial<IItem>[]
  imageUrl: string
}

export type IBiomeExtended = IBiome & { creatures: any[],  }

export type ItemGroup =
  | 'ashtree'
  | 'banner' | 'bed' | 'beech' | 'berry' | 'birch' | 'bird' | 'blob'
  | 'chair' | 'chest' | 'cook' | 'craft_station'
  | 'demist'
  | 'fir' | 'fire' | 'fish'
  | 'gem' | 'goblin' | 'gray'
  | 'hide'
  | 'lumber'
  | 'metal'
  | 'ore'
  | 'rug' | 'runestone'
  | 'seedTree' | 'seedVeg' | 'seeker' | 'ship' | 'smelt' | 'stack' | 'stand'
  | 'torch' | 'trader'
  | 'value'
  | 'semiboss'

export type Biome =
  | 'Meadows'
  | 'BlackForest'
  | 'Swamp'
  | 'Mountain'
  | 'Plains'
  | 'Ocean'
  | 'Mistlands'
  | 'DeepNorth'
  | 'Ashlands';

export type ItemType = 
  | "armors"
  | "arrows"
  | "bolts"
  | "missiles"
  | "bombs"
  | "shields"
  | "buildings"
  | "creatures"
  | "effects"
  | "fishes"
  | "objects"
  | "resources"
  | "spawners"
  | "tools"
  | "ships"
  | "sieges"
  | "carts"
  | "weapons";

export type StationType = 
  | "piece_cauldron"
  | "piece_oven"
  | "piece_workbench"
  | "piece_stonecutter"
  | "piece_artisanstation"
  | "forge"
  | "blackforge"
  | "piece_magetable"
  | "piece_enchanter"
  | "piece_augmenter"