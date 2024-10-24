import { Routes, Route } from "react-router-dom"
import AuthLayout from "./_auth/AuthLayout"
import SigninForm from "./_auth/forms/SigninForm"
import SignupForm from "./_auth/forms/SignupForm"
import { Toaster } from "./components/ui/toaster"
import RootLayout from "./_root/RootLayout"
import Home from "./_root/pages/Home"
import Item from "./_root/pages/Item"
import ResourceCalculator from "./_root/pages/ResourceCalculator"
import About from "./_root/pages/About"
import Settings from "./_root/pages/Settings"

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/*public routes*/}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/*private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/item/:id" element={<Item />} />
          <Route path="/resource-calculator" element={<ResourceCalculator />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

/*
/obj/:id .... {
    0. armor/weapon/armor/creature ? 
    1. resource 
    2. crafting
    3. drops from 
    4. extracted from
    5. creature ? drops

    6. craftable ? recipe table
}
*/

export default App
