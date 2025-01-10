import { Route, Routes } from "react-router-dom"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/toaster"
import { APP_PAGES, INestedPage } from "./types/pages"
import NotFoundPage from "./_root/pages/NotFound"

function App() {
  const generateRoutes = (pages: INestedPage[]) => {
    return pages.map((page) => {
      const route = (
        <Route key={page.id} path={page.path} element={page.element}>
          {page.children && generateRoutes(page.children)}
        </Route>
      )
      return route
    })
  }

  return (
    <main className="min-h-screen flex justify-center">
      <Routes>
        {APP_PAGES.map((group) => {
          const Layout = group.layout === "auth" ? AuthLayout : RootLayout
          return (
            <Route key={group.layout} element={<Layout />}>
              {generateRoutes(group.pages)}
            </Route>
          )
        })}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </main>
  )
}

export default App
