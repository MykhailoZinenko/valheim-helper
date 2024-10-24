import LeftSidebar from "@/components/shared/LeftSidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <SidebarProvider className="bg-color-primary-bg">
      <div className="w-full min-h-100vh h-full flex bg-color-primary-bg">
        <LeftSidebar />

        <section className="h-full w-full flex flex-col items-center">
          <SidebarTrigger className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover self-start m-6 min-h-[28px] min-w-[28px]" />
          <div className="h-full w-full p-12 pt-6 max-w-5xl">
            <Outlet />
          </div>
        </section>
      </div>
    </SidebarProvider>
  )
}

export default RootLayout
