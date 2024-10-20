import { Button } from '@/components/ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const RootLayout = () => {
  const navigate = useNavigate()
  const { mutate: signOut, isSuccess } = useSignOutAccount()

  useEffect(() => {
    if (isSuccess) {
      navigate(0)
    }
  }, [isSuccess])

  return (
    <div className="h-full w-full flex flex-col items-center p-8">
      <Outlet />

      <Button className="mt-4" onClick={() => signOut()}>
        <p className="base-medium">Logout</p>
      </Button>
    </div>
  )
}

export default RootLayout
