import { useUserContext } from "@/context/AuthContext"

const Home = () => {
  const { user } = useUserContext()

  return (
    <div className="flex">
      <div className="text-center w-full text-color-text-primary">
        <h1 className="text-5xl">Valheim helper 👍</h1>
        <h2 className="text-3xl mt-4">Work in progress...</h2>
        <ol className="font-mono list-decimal list-inside w-fit text-left mt-4">
          <li>{user.id}</li>
          <li>{user.name}</li>
          <li>{user.email}</li>
        </ol>
      </div>
    </div>
  )
}

export default Home
