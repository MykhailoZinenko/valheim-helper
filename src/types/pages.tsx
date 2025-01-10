import SigninForm from "@/_auth/forms/SigninForm"
import SignupForm from "@/_auth/forms/SignupForm"
import OAuthSuccess from "@/_auth/OAuthSuccess"
import About from "@/_root/pages/About"
import ApiDocumentation from "@/_root/pages/ApiDocumentation"
import Biome from "@/_root/pages/Biome"
import FoodCalculator from "@/_root/pages/FoodCalculator"
import Home from "@/_root/pages/Home"
import ItemPage from "@/_root/pages/ItemPage"
import ResourceCalculator from "@/_root/pages/ResourceCalculator"
import Settings from "@/_root/pages/Settings"

// Types for page structure
export interface IBasePage {
  id: string
  type: "home" | "biome" | "calculator" | "settings" | "about" | "auth" | "item"
  title: string
  path: string
  description?: string
  icon?: string
  element?: React.ReactNode
  isPublic?: boolean
  searchable?: boolean // Whether this page should appear in search results
  isDynamic?: boolean // For paths with parameters like :id
  dynamicSegments?: string[] // List of dynamic segments in the path
}

export interface INestedPage extends IBasePage {
  children?: INestedPage[]
}

// Layout types
export type LayoutType = "root" | "auth" | null

export interface IPageGroup {
  layout: LayoutType
  pages: INestedPage[]
}

// Example page structure
export const BIOMES_PAGES: IBasePage[] = [
  {
    id: "meadows",
    type: "biome",
    title: "Meadows",
    path: "/biome/Meadows",
    description: "Starting biome with basic resources",
    icon: "/icons/biomes/meadows.png",
    searchable: true,
  },
  {
    id: "black-forest",
    type: "biome",
    title: "Black Forest",
    path: "/biome/BlackForest",
    description: "Dark forest with advanced minerals",
    icon: "/icons/biomes/black-forest.png",
    searchable: true,
  },
  {
    id: "swamp",
    type: "biome",
    title: "Swamp",
    path: "/biome/Swamp",
    description: "Wet lands with unique resources",
    icon: "/icons/biomes/swamp.png",
    searchable: true,
  },
  {
    id: "mountain",
    type: "biome",
    title: "Mountain",
    path: "/biome/Mountain",
    description: "High altitude area with silver deposits",
    icon: "/icons/biomes/mountain.png",
    searchable: true,
  },
  {
    id: "plains",
    type: "biome",
    title: "Plains",
    path: "/biome/Plains",
    description: "Open fields with advanced challenges",
    icon: "/icons/biomes/plains.png",
    searchable: true,
  },
  {
    id: "mistlands",
    type: "biome",
    title: "Mistlands",
    path: "/biome/Mistlands",
    description: "Mysterious foggy realm",
    icon: "/icons/biomes/mistlands.png",
    searchable: true,
  },
  {
    id: "ashlands",
    type: "biome",
    title: "Ashlands",
    path: "/biome/Ashlands",
    description: "Volcanic region with unique dangers",
    icon: "/icons/biomes/ashlands.png",
    searchable: true,
  },
]

export const APP_PAGES: IPageGroup[] = [
  {
    layout: "auth",
    pages: [
      {
        id: "sign-in",
        type: "auth",
        title: "Sign In",
        path: "/sign-in",
        element: <SigninForm />,
        searchable: false,
        isPublic: true,
      },
      {
        id: "sign-up",
        type: "auth",
        title: "Sign Up",
        path: "/sign-up",
        element: <SignupForm />,
        searchable: false,
        isPublic: true,
      },
      {
        id: "oauth-success",
        type: "auth",
        title: "OAuth Success",
        path: "/success",
        element: <OAuthSuccess />,
        searchable: false,
        isPublic: true,
      },
    ],
  },
  {
    layout: "root",
    pages: [
      {
        id: "home",
        type: "home",
        title: "Home",
        path: "/",
        element: <Home />,
        icon: "/icons/home.png",
        description: "Main dashboard",
        searchable: true,
      },
      {
        id: "about",
        type: "about",
        title: "About",
        path: "/about",
        element: <About />,
        icon: "/icons/about.png",
        description: "About the game",
        searchable: true,
      },
      {
        id: "settings",
        type: "settings",
        title: "Settings",
        path: "/settings",
        element: <Settings />,
        icon: "/icons/settings.png",
        description: "App settings",
        searchable: true,
      },
      {
        id: "api-documentation",
        type: "settings",
        title: "API Documentation",
        path: "/api-documentation",
        element: <ApiDocumentation />,
        icon: "/icons/api.png",
        description: "API documentation",
        searchable: true,
      },
      {
        id: "biomes",
        type: "biome",
        title: "Biomes",
        path: "/biome/:id",
        element: <Biome />,
        icon: "/icons/biomes.png",
        description: "Explore all biomes",
        searchable: true,
        isDynamic: true,
        dynamicSegments: ["id"],
      },
      {
        id: "items",
        type: "item",
        title: "Items",
        path: "/item/:id",
        icon: "/icons/item.png",
        description: "Item details",
        element: <ItemPage />,
        searchable: true,
        isDynamic: true,
        dynamicSegments: ["id"],
        children: [
          {
            id: "item-level",
            type: "item",
            title: "Item Level",
            path: "/item/:id/:level",
            element: <ItemPage />,
            searchable: false,
            isDynamic: true,
            dynamicSegments: ["id", "level"],
          },
        ],
      },
      {
        id: "calculators",
        type: "calculator",
        title: "Calculators",
        path: "/calculators",
        icon: "/icons/calculator.png",
        description: "Game calculators",
        searchable: true,
        children: [
          {
            id: "resource-calculator",
            type: "calculator",
            title: "Resource Calculator",
            path: "/calculators/resource",
            element: <ResourceCalculator />,
            description: "Calculate resource production",
            searchable: true,
          },
          {
            id: "food-calculator",
            type: "calculator",
            title: "Food Calculator",
            path: "/calculators/food",
            element: <FoodCalculator />,
            description: "Calculate food production",
            searchable: true,
          },
        ],
      },
    ],
  },
]

// First, let's create a function to get all static pages (like biomes)
const getStaticPages = (): IBasePage[] => {
  // This could be expanded to include other static page arrays
  return [...BIOMES_PAGES]
}

// Modified flattening function
const flattenPages = (pages: INestedPage[]): IBasePage[] => {
  return pages.reduce<IBasePage[]>((acc, page) => {
    if (!page.searchable) return acc

    // Skip parent biome page since we'll add individual biomes separately
    if (page.id === "biomes" && page.children) {
      acc.push(...flattenPages(page.children))
      return acc
    }

    const basePage: IBasePage = {
      id: page.id,
      type: page.type,
      title: page.title,
      path: page.path,
      description: page.description,
      icon: page.icon,
      isDynamic: page.isDynamic,
      dynamicSegments: page.dynamicSegments,
    }

    acc.push(basePage)

    if (page.children) {
      acc.push(...flattenPages(page.children))
    }

    return acc
  }, [])
}

// Updated function to get all searchable pages
export const getSearchablePages = () => {
  // Get dynamic pages from APP_PAGES
  const allPages = APP_PAGES.reduce<INestedPage[]>((acc, group) => {
    acc.push(...group.pages)
    return acc
  }, [])

  // Get flattened dynamic pages
  const flattenedPages = flattenPages(allPages)

  // Get static pages
  const staticPages = getStaticPages()

  // Combine both sets of pages, removing any duplicates by ID
  const combinedPages = [...flattenedPages, ...staticPages]
  const uniquePages = combinedPages.reduce<IBasePage[]>((acc, page) => {
    if (!acc.find((p) => p.id === page.id)) {
      acc.push(page)
    }
    return acc
  }, [])

  return uniquePages
}

// Navigation helper function remains the same but with improved type safety
export const generatePagePath = (
  page: IBasePage,
  params?: Record<string, string>
): string => {
  if (!page.isDynamic || !params) return page.path

  let path = page.path
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value)
  })

  return path
}

// New helper function to check if a page is a static page
export const isStaticPage = (page: IBasePage): boolean => {
  return BIOMES_PAGES.some((staticPage) => staticPage.id === page.id)
}

// New helper to get page type label for display
export const getPageTypeLabel = (page: IBasePage): string => {
  const typeLabels: Record<string, string> = {
    biome: "Biome",
    calculator: "Calculator",
    item: "Item",
    home: "Page",
    settings: "Settings",
    about: "Page",
  }

  return typeLabels[page.type] || "Page"
}
