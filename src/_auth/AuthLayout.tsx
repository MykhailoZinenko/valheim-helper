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

          <div className="absolute top-0 left-0 w-full h-full z-[-1] overflow-hidden">
            <img
              src="/assets/images/side-img.png"
              alt="logo"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="bg-black opacity-25 z-1 w-full h-full" />
            <div className="absolute inset-0 bg-gradient-to-t from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-l from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-bl from-color-primary-bg from-[-25%] via-transparent to-transparent"></div>
          </div>
        </div>
      )}
    </>
  )
}

export default AuthLayout
