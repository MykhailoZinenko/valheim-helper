import VignetteImage from "@/components/shared/VignetteImage"
import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAuthenticated = false

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <div className="relative w-full">
          <section className="flex flex-1 w-full justify-center items-center flex-col">
            <Outlet />
          </section>

          <VignetteImage
            src="/assets/images/side-img.webp"
            variant="absolute"
            fromColor="from-color-primary-bg"
          />
        </div>
      )}
    </>
  )
}

export default AuthLayout
