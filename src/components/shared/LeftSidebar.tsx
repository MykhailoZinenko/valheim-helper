import {
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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations"
import { Link, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useUserContext } from "@/context/AuthContext"

const mainLinks = [
  {
    name: "Home",
    icon: <HomeIcon />,
    path: "/",
  },
  { name: "About", icon: <InfoIcon />, path: "/about" },
  { name: "Settings", icon: <SettingsIcon />, path: "/settings" },
]

const calculatorsLinks = [
  {
    name: "Resource",
    icon: <CalculatorIcon />,
    path: "/resource-calculator",
  },
]

const LeftSidebar = () => {
  const { user } = useUserContext()
  const { mutate: signOut, isSuccess } = useSignOutAccount()

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
          <SidebarGroupLabel className="text-[14px]">
            Calculators
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {calculatorsLinks.map(({ name, icon, path }) => (
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="h-12">
                <SidebarMenuButton>
                  <User2 className="!size-6" />
                  <div className="flex flex-col">
                    <span className="text-[16px]">{user.name}</span>
                    <span className="text-xs text-color-text-tertiary">
                      {user.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="right"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => signOut()}>
                  <span className="text-[16px]">Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export default LeftSidebar
