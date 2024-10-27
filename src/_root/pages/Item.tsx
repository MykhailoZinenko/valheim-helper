import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"
import Creature from "./items/Creature"

const Item = () => {
  const { id } = useParams()

  const { data, isLoading } = useGetItemById(id || "")

  return isLoading ? (
    <div>Loading...</div>
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
