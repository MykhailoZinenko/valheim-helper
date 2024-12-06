import {
  AppleIcon,
  CalculatorIcon,
  ChevronUp,
  HomeIcon,
  InfoIcon,
  SettingsIcon,
  User2,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { Button } from "../ui/button"
import SubscriptionPlan from "./SubscriptionPlan"
import { useMediaQuery } from "@/hooks/use-media-query"

const mainLinks = [
  {
    name: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  { name: "About", icon: <InfoIcon />, path: "/about" },
  { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
]

const biomeLinks = [
  {
    name: "Meadows",
    path: "/biome/Meadows",
  },
  {
    name: "Black Forest",
    path: "/biome/BlackForest",
  },
  {
    name: "Swamp",
    path: "/biome/Swamp",
  },
  {
    name: "Mountain",
    path: "/biome/Mountain",
  },
  {
    name: "Plains",
    path: "/biome/Plains",
  },
  {
    name: "Mistlands",
    path: "/biome/Mistlands",
  },
  {
    name: "Ashlands",
    path: "/biome/Ashlands",
  },
]

const calculatorLinks = [
  {
    name: "Resource",
    icon: <CalculatorIcon />,
    path: "/calculators/resource",
  },
  {
    name: "Food",
    icon: <AppleIcon />,
    path: "/calculators/food",
  },
]

const LeftSidebar = () => {
  const { user } = useUserContext()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return (
    <Sidebar className="p-2 xl:left-auto" variant="floating">
      <SidebarHeader className="p-4">
        <h2 className="text-4xl font-norse font-bold">Valheim helper</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainLinks.map(({ name, icon, path }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton asChild>
                    <Link to={path}>
                      {icon}
                      <span className="text-[16px]">{name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarGroupLabel className="text-[14px]">
                Biomes
              </SidebarGroupLabel>
              <SidebarMenuSub>
                {biomeLinks.map(({ name, path }) => (
                  <SidebarMenuSubItem key={name}>
                    <SidebarMenuButton asChild>
                      <Link to={path}>
                        <span className="text-[16px]">{name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[14px]">
            Calculators
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {calculatorLinks.map(({ name, icon, path }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton asChild>
                    <Link to={path}>
                      {icon}
                      <span className="text-[16px]">{name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild className="h-12">
                <SidebarMenuButton>
                  <User2 className="!size-6" />
                  <div className="flex flex-col *:hover:text-color-button-text">
                    <span className="text-[16px]">{user.name}</span>
                    <span className="text-xs text-color-text-tertiary">
                      {user.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                side={isDesktop ? "right" : "top"}
                sideOffset={isDesktop ? 16 : 4}
                align="end"
                className="w-[--radix-popper-anchor-width]"
              >
                <SubscriptionPlan plan={user.plan} />
                <Button
                  onClick={() => signOut()}
                  className="w-full text-color-button-text bg-color-button-bg hover:bg-color-button-hover text-start flex justify-start mt-2"
                >
                  <span className="text-[16px]">Sign out</span>
                </Button>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default LeftSidebar
