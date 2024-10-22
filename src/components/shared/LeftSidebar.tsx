import { CalculatorIcon, ChevronUp, HomeIcon, User2 } from "lucide-react"

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
    <Sidebar className="p-2">
      <SidebarHeader className="p-4">
        <h2 className="text-3xl font-norse">Valheim helper</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"home"}>
                <SidebarMenuButton asChild>
                  <Link to={"/"}>
                    <HomeIcon />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Calculators</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"resource-calc"}>
                <SidebarMenuButton asChild>
                  <Link to={"/resource-calculator"}>
                    <CalculatorIcon />
                    <span>Resource</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
                    <span>{user.name}</span>
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
                  <span>Sign out</span>
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
