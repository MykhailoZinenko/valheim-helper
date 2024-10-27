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
          <div className="w-full xl:w-fit xl:self-end flex justify-between xl:justify-end p-6 xl:pl-0 pr-12 pb-2 sticky xl:fixed top-0 bg-color-primary-bg">
            <SidebarTrigger className="bg-color-button-bg text-color-button-text hover:bg-color-button-hover" />

            <Search />
          </div>

          <div className="w-full p-12 pt-7 xl:pr-[104px] xl:pt-6 max-w-5xl">
            <Outlet />
          </div>
        </section>
      </div>
    </SidebarProvider>
  )
}

export default RootLayout
