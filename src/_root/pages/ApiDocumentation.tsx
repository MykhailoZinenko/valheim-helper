import { useMemo, useState } from "react"
import {
  LockOpen,
  Lock,
  Key,
  Search,
  MapPin,
  Apple,
  Sword,
  MessageSquare,
  Code,
} from "lucide-react"
import APIBlock from "@/components/shared/APIBlock"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { debounce } from "lodash"
import Fuse from "fuse.js"

interface IEndpoint {
  id: number
  name: string
  category: string
  path: string
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH"
  authentication: string
  request: {
    headers: {
      [key: string]: string
    }
    body?: {
      [key: string]: string
    }
    params?: {
      [key: string]: string
    }
    query?: {
      [key: string]: string
    }
  }
  response: {
    [key: string]: any
  }
  description: string
}

const ENDPOINTS: IEndpoint[] = [
  {
    id: 1,
    name: "Validate Session",
    category: "Authentication",
    path: "/auth/validate-session",
    method: "POST",
    authentication: "none",
    request: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        appwriteJWT: "string (required)",
      },
    },
    response: {
      200: {
        token: "string",
        expires: "number (timestamp)",
      },
      401: {
        error: "Invalid session",
      },
    },
    description:
      "Validates the user's Appwrite JWT and returns an application token.",
  },
  {
    id: 2,
    name: "Create API Key",
    category: "Developer",
    path: "/developer/keys",
    method: "POST",
    authentication: "none",
    request: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        userId: "string (required)",
        name: "string (required)",
      },
    },
    response: {
      200: {
        key: "string",
        name: "string",
        created: "string (ISO 8601 date)",
        user: "string",
        status: "string",
        lastUsed: "string | null",
      },
      400: {
        error: "User ID or key name is required.",
      },
      403: {
        error: "API key limit reached for your plan",
        upgradeLink: "string",
      },
    },
    description: "Creates a new API key for the authenticated user.",
  },
  {
    id: 3,
    name: "Get API Keys",
    category: "Developer",
    path: "/developer/keys",
    method: "GET",
    authentication: "none",
    request: {
      headers: {
        Authorization: "User <userId>",
      },
    },
    response: {
      200: {
        keysData: "Array of API key objects",
        userPlan: "Object (current plan details)",
      },
      401: {
        error: "Unauthorized. Missing or invalid user token.",
      },
    },
    description:
      "Retrieves all API keys associated with the authenticated user.",
  },
  {
    id: 4,
    name: "Revoke API Key",
    category: "Developer",
    path: "/developer/keys/:keyId/revoke",
    method: "POST",
    authentication: "none",
    request: {
      headers: {
        Authorization: "User <userId>",
      },
    },
    response: {
      200: {
        message: "API key revoked successfully",
      },
      401: {
        error: "Unauthorized. Missing or invalid user token.",
      },
      403: {
        error: "Forbidden. Key doesn't belong to user.",
      },
    },
    description: "Revokes a specific API key by ID for the authenticated user.",
  },
  {
    id: 5,
    name: "Get API Key Details",
    category: "Developer",
    path: "/developer/keys/:keyId",
    method: "GET",
    authentication: "none",
    request: {
      headers: {
        Authorization: "User <userId>",
      },
    },
    response: {
      200: {
        key: "Object (API key details)",
      },
      401: {
        error: "Unauthorized. Missing or invalid user token.",
      },
      403: {
        error: "Forbidden. Key doesn't belong to user.",
      },
    },
    description:
      "Fetches details of a specific API key by ID for the authenticated user.",
  },
  {
    id: 6,
    name: "Send Feedback",
    category: "Feedback",
    path: "/feedback",
    method: "POST",
    authentication: "User API key in header (x-api-key)",
    request: {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "string (required)",
      },
      body: {
        name: "string (required)",
        email: "string (required)",
        issueType: "string (required)",
        description: "string (required)",
      },
    },
    response: {
      200: {
        success: true,
        message: "Feedback sent successfully",
      },
      400: {
        success: false,
        message: "Missing required fields",
      },
    },
    description: "Sends user feedback to the support team via Telegram.",
  },
  {
    id: 7,
    name: "Get All Items",
    category: "Items",
    path: "/items",
    method: "GET",
    authentication: "x-api-key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
    },
    response: {
      200: {
        total: "number",
        items: "Array of item objects",
      },
      401: {
        error: "Unauthorized. Invalid or missing API key.",
      },
    },
    description: "Fetches a list of all items.",
  },
  {
    id: 8,
    name: "Get Calculator Items",
    category: "Items",
    path: "/items/calculator",
    method: "GET",
    authentication: "x-api-key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
    },
    response: {
      200: {
        total: "number",
        items: "Array of calculator item objects",
      },
      401: {
        error: "Unauthorized. Invalid or missing API key.",
      },
    },
    description: "Fetches items available for calculator.",
  },
  {
    id: 9,
    name: "Get Item Details",
    category: "Items",
    path: "/items/:itemId",
    method: "GET",
    authentication: "x-api-key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
    },
    response: {
      200: {
        item: "Object (item details)",
        recipe: "Object (item recipe details)",
      },
      401: {
        error: "Unauthorized. Invalid or missing API key.",
      },
      404: {
        error: "Item not found.",
      },
    },
    description: "Fetches details of a specific item by its ID.",
  },
  {
    id: 10,
    name: "Get Items by Type",
    category: "Items",
    path: "/items/type/:type",
    method: "GET",
    authentication: "x-api-key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
    },
    response: {
      200: {
        total: "number",
        typeIdentifier: "string",
        type: "string",
        items: "Array of item objects of the specified type",
      },
      401: {
        error: "Unauthorized. Invalid or missing API key.",
      },
      404: {
        error: "Invalid type.",
      },
    },
    description: "Fetches items of a specific type.",
  },
  {
    id: 11,
    name: "Get All Biomes",
    category: "Biomes",
    path: "/biomes",
    method: "GET",
    authentication: "API Key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
    },
    response: {
      200: {
        total: "number",
        items: "Array of biome objects",
      },
      401: {
        error: "Unauthorized - Invalid or missing API Key",
      },
      500: {
        error: "Error fetching biome data",
      },
    },
    description:
      "Fetches data for all biomes, including bosses and descriptions. Requires a valid API key.",
  },
  {
    id: 12,
    name: "Get Specific Biome",
    category: "Biomes",
    path: "/biomes/:biomeName",
    method: "GET",
    authentication: "API Key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
      params: {
        biomeName: "string (required)",
      },
    },
    response: {
      200: {
        name: "string",
        description: "string",
        bosses: {
          total: "number",
          items: "Array of boss objects",
        },
        imageUrl: "string",
        creatures: {
          total: "number",
          items: "Array of creature objects",
        },
        resources: {
          total: "number",
          items: "Array of resource objects",
        },
        food: {
          total: "number",
          items: "Array of food objects",
        },
      },
      401: {
        error: "Unauthorized - Invalid or missing API Key",
      },
      404: {
        error: "Biome not found",
      },
      500: {
        error: "Error fetching biome data",
      },
    },
    description:
      "Fetches detailed data for a specific biome, including bosses, creatures, and resources. Requires a valid API key.",
  },
  {
    id: 13,
    name: "Get All Food Items",
    category: "Food",
    path: "/food",
    method: "GET",
    authentication: "API Key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
      query: {
        type: "string (optional) - Filter by food type (e.g., stamina, health)",
        biome: "string (optional) - Filter by biome association",
      },
    },
    response: {
      200: {
        total: "number",
        items: "Array of food item objects",
      },
      401: {
        error: "Unauthorized - Invalid or missing API Key",
      },
      500: {
        error: "Error fetching food data",
      },
    },
    description:
      "Fetches all food items with optional filters for type and biome. Requires a valid API key.",
  },
  {
    id: 14,
    name: "Get Food Item Details",
    category: "Food",
    path: "/food/:foodId",
    method: "GET",
    authentication: "API Key",
    request: {
      headers: {
        "x-api-key": "string (required)",
      },
      params: {
        foodId: "string (required) - The ID of the food item",
      },
    },
    response: {
      200: {
        item: {
          id: "string",
          readableName: "string",
          icon: "string",
          originalName: "string",
          type: "string",
          tier: "number",
          biomes: "Array of strings",
          group: "string",
          station: "string",
          Food: {
            health: "number",
            stamina: "number",
            duration: "number",
            regen: "number",
          },
        },
        recipe: {
          ingredients: "Array of ingredient objects",
          station: "string",
          level: "number",
        },
      },
      401: {
        error: "Unauthorized - Invalid or missing API Key",
      },
      404: {
        error: "Food item not found",
      },
      500: {
        error: "Error fetching food details",
      },
    },
    description:
      "Fetches detailed information about a specific food item, including recipe and stats. Requires a valid API key.",
  },
]

interface ICategory {
  id: string
  name: string
  icon: any
}

const CATEGORIES = [
  { id: "authentication", name: "Authentication", icon: Key },
  { id: "developer", name: "Developer", icon: Code },
  { id: "biomes", name: "Biomes", icon: MapPin },
  { id: "food", name: "Food", icon: Apple },
  { id: "items", name: "Items", icon: Sword },
  { id: "feedback", name: "Feedback", icon: MessageSquare },
]

const fuseOptions = {
  keys: ["name", "path", "description"],
  threshold: 0.3,
  includeScore: true,
}

const PlanCard = ({
  title,
  features,
}: {
  title: string
  features: string[]
}) => (
  <div className="p-6 rounded-lg border">
    <h3 className="text-xl font-bold mb-4">{title}</h3>
    <ul className="space-y-2">
      {features.map((feature, index) => (
        <li key={index}>• {feature}</li>
      ))}
    </ul>
  </div>
)

const CategoryButton = ({
  category,
  isSelected,
  onClick,
}: {
  category: ICategory
  isSelected: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors
      ${
        isSelected
          ? "bg-primary text-primary-foreground"
          : "bg-secondary hover:bg-secondary/80"
      }`}
  >
    <category.icon className="w-4 h-4" />
    {category.name}
  </button>
)

const EndpointCard = ({ endpoint }: { endpoint: IEndpoint }) => (
  <Card id={endpoint.id.toString()}>
    <CardHeader>
      <div className="flex items-start justify-between gap-4">
        <div>
          <CardTitle>{endpoint.name}</CardTitle>
          <CardDescription>{endpoint.description}</CardDescription>
        </div>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold
            ${
              endpoint.authentication === "none"
                ? "bg-green-500/10 text-green-500 ring-1 ring-green-500/20"
                : "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20"
            }`}
        >
          {endpoint.authentication === "none" ? "Public" : "Protected"}
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <APIBlock
        method={endpoint.method}
        endpoint={endpoint.path}
        example={{
          request: endpoint.request,
          response: JSON.stringify(endpoint.response, null, 2),
        }}
      />
    </CardContent>
  </Card>
)

const ApiDocumentation = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const fuse = useMemo(() => new Fuse(ENDPOINTS, fuseOptions), [ENDPOINTS])

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        setSearchQuery(query)
      }, 300),
    []
  )

  const filteredEndpoints = useMemo(() => {
    let results = searchQuery
      ? fuse.search(searchQuery).map((result) => result.item)
      : ENDPOINTS

    if (selectedCategory) {
      results = results.filter(
        (endpoint) =>
          endpoint.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    return results
  }, [searchQuery, selectedCategory, ENDPOINTS, fuse])

  return (
    <div className="space-y-6">
      <section className="space-y-6">
        <h1 className="text-4xl md:text-5xl font-norse font-bold">
          API Documentation
        </h1>
        <div className="space-y-4">
          <p>
            Welcome to the Valheim Helper API documentation. Our API allows you
            to access comprehensive data about Valheim's biomes, items,
            creatures, and more.
          </p>
          <p>The API is available in two tiers:</p>
          <ul>
            <li className="flex items-center gap-2">
              <LockOpen className="w-4 h-4" />
              <span>Public endpoints - no authentication required</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Protected endpoints - requires API key</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search endpoints..."
              onChange={(e) => debouncedSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap pb-2 md:pb-0">
            {CATEGORIES.map((category) => (
              <CategoryButton
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              />
            ))}
          </div>
        </div>

        {filteredEndpoints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No endpoints found matching your search criteria
          </div>
        ) : (
          <div className="space-y-6">
            {filteredEndpoints.map((endpoint) => (
              <EndpointCard key={endpoint.id} endpoint={endpoint} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold font-norse">
          Rate Limits & Plans
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Available Plans</CardTitle>
            <CardDescription>
              Choose the plan that best fits your needs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <PlanCard
                title="Basic Plan"
                features={[
                  "1,000 requests per hour",
                  "3 API keys",
                  "Basic endpoints access",
                  "Limited data transfer",
                ]}
              />
              <PlanCard
                title="Pro Plan"
                features={[
                  "10,000 requests per hour",
                  "10 API keys",
                  "Full API access",
                  "Extended data transfer",
                ]}
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default ApiDocumentation
