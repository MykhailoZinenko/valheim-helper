import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"
import Creature from "./items/Creature"
import Loader from "@/components/shared/Loader"

const Item = () => {
  const { id } = useParams()

  const { data, isLoading } = useGetItemById(id || "")

  return isLoading ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <>
      {data.item.type === "creature" ? (
        <Creature data={data.item} />
      ) : (
        <>
          <div>{data.item.id + " " + data.item.type}</div>
          {/* <pre>{JSON.stringify(data.item, null, 2)}</pre>{" "} */}
        </>
      )}
    </>
  )
}

export default Item
