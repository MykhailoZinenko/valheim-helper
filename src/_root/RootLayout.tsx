import Feedback from "@/components/shared/Feedback"
import LeftSidebar from "@/components/shared/LeftSidebar"
import Search from "@/components/shared/Search"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

const RootLayout = () => {
  return (
    <SidebarProvider className="mx-auto bg-color-primary-bg max-w-screen-xl">
      {" "}
      <div className="w-full flex bg-color-primary-bg">
        <LeftSidebar />

        <section className="w-full flex flex-col items-center">
          <div className="w-full xl:w-fit xl:self-end flex justify-between xl:justify-end p-2 xl:pl-0 sticky xl:fixed top-0 bg-color-primary-bg">
            <SidebarTrigger className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover" />

            <div className="flex space-x-2">
              <Feedback />
              <Search />
            </div>
          </div>

          <div className="w-full h-full p-12 pt-7 xl:pr-[104px] xl:pt-6 max-w-5xl">
            <Outlet />
          </div>
        </section>
      </div>
    </SidebarProvider>
  )
}

export default RootLayout
