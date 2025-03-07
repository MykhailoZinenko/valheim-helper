import Feedback from "@/components/shared/Feedback"
import LeftSidebar from "@/components/shared/LeftSidebar"
import Search from "@/components/shared/Search"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <div className="relative w-full max-w-screen-xl xl:max-w-screen-2xl">
      <SidebarProvider>
        {" "}
        <LeftSidebar />
        <section className="w-full flex flex-col items-center px-8">
          <div className="w-full 2xl:w-fit 2xl:self-end flex justify-between 2xl:justify-end 2xl:rounded-md sticky 2xl:fixed top-0 z-20 py-4 bg-transparent">
            <SidebarTrigger className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover" />

            <div className="flex space-x-2">
              <Feedback />
              <Search variant="dialog" />
            </div>
          </div>

          <div className="w-full h-full max-w-screen-xl py-4 2xl:py-24">
            <Outlet />
          </div>
        </section>
      </SidebarProvider>
    </div>
  )
}

export default RootLayout
