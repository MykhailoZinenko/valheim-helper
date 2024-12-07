import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import ItemHeader from "@/components/shared/ItemHeader"
import { Creature } from "@/types"

const Item = () => {
  const { id } = useParams()

  const { data, isPending, isError } = useGetItemById(id || "")

  const maxLevel =
    data &&
    data.item &&
    (data.item as Creature).spawners &&
    (data.item as Creature).spawners.length > 0
      ? (data.item as Creature).spawners.reduce(
          (m, s) => Math.max(m, s.levels[1]),
          0
        )
      : 1

  return isPending || isError ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <div>
      <ItemHeader data={data.item} maxLevel={maxLevel}>
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      </ItemHeader>
    </div>
  )
}

export default Item
