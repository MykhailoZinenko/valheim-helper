import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom"
import Loader from "@/components/shared/Loader"
import ItemHeader from "@/components/shared/ItemHeader"
import { Creature, IItem, Item } from "@/types"
import Recipe from "@/components/shared/Recipe"
import { maxLevel } from "@/utils"

const ItemPage = () => {
  const { id } = useParams()

  const { data, isPending, isError } = useGetItemById(id || "")

  return isPending || isError ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <div>
      <ItemHeader data={data.item} maxLevel={maxLevel(data)}>
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(data, null, 2)}
        </pre>
      </ItemHeader>
      {data.recipe && (
        <>
          <h2 className="text-4xl font-norse mt-6 mb-2">Recipe</h2>
          <Recipe
            recipe={data.recipe}
            maxQuality={(data.item as IItem<Item>).maxLvl ?? 1}
          />
        </>
      )}
    </div>
  )
}

export default ItemPage
