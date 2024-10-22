import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"

const Item = () => {
  const { id } = useParams()

  const { data, isLoading } = useGetItemById(id || "")

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <div>{data.item.id + " " + data.item.type}</div>
  )
}

export default Item
