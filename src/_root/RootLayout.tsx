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
        <section className="w-full flex flex-col items-center">
          <div className="w-full 2xl:w-fit 2xl:self-end flex justify-between 2xl:justify-end p-6 2xl:rounded-md sticky 2xl:fixed top-0 bg-color-primary-bg z-20">
            <SidebarTrigger className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover" />

            <div className="flex space-x-2">
              <Feedback />
              <Search variant="dialog" />
            </div>
          </div>

          <div className="w-full h-full p-6 pt-4 2xl:pt-6 2xl:pr-32 max-w-screen-xl">
            <Outlet />
          </div>
        </section>
      </SidebarProvider>
    </div>
  )
}

export default RootLayout
