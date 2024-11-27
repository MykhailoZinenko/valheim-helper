import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import ItemHeader from "@/components/shared/ItemHeader"

const Item = () => {
  const { id } = useParams()

  const { data, isLoading } = useGetItemById(id || "")

  const maxLevel =
    data && data.item && data.item.spawners && data.item.spawners.length > 0
      ? data.item.spawners.reduce(
          (m: any, s: any) => Math.max(m, s.levels[1]),
          0
        )
      : 1

  return isLoading ? (
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
