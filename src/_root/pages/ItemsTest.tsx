import { useGetItems } from "@/lib/react-query/queriesAndMutations"
import { IItem } from "@/types"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"

const ItemsTest = () => {
  const { data, isLoading } = useGetItems()

  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <h1 className="text-5xl font-norse font-bold text-color-text-primary">
            Valheim helper
          </h1>
          <h2 className="text-3xl mt-2 font-norse text-color-text-secondary">
            Explore items
          </h2>
          <ol className="font-mono list-decimal list-inside w-full text-left mt-4">
            {data.items?.map((item: IItem) => (
              <li key={item.id}>
                <img src={item.icon} />{" "}
                <Link to={`/item/${item.id}`}>{item.name}</Link>{" "}
                {" " + item.type}
              </li>
            ))}
          </ol>
        </>
      )}
    </div>
  )
}

export default ItemsTest
