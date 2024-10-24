import { useGetItems } from "@/lib/react-query/queriesAndMutations"
import { IItem } from "@/types"
import { Link } from "react-router-dom"

const Home = () => {
  const { data, isLoading } = useGetItems()

  return (
    <div className="flex">
      <div className="text-center w-full text-color-text-primary">
        <h1 className="text-5xl font-norse font-bold">Valheim helper</h1>
        <h2 className="text-3xl mt-4 font-norse text-color-text-secondary">
          Explore items
        </h2>
        <ol className="font-mono list-decimal list-inside w-fit text-left mt-4">
          {isLoading ? (
            <li>Loading...</li>
          ) : (
            data.items?.map((item: IItem) => (
              <li key={item.id}>
                <img src={item.icon} />{" "}
                <Link to={`/item/${item.id}`}>{item.name}</Link>{" "}
                {" " + item.type}
              </li>
            ))
          )}
        </ol>
      </div>
    </div>
  )
}

export default Home
