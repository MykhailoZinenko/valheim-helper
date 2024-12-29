import { useGetItemById } from "@/lib/react-query/queriesAndMutations"
import { ItemRecipe } from "@/types"
import { capitalize } from "lodash"
import { FC } from "react"
import ItemLink from "./ItemLink"

interface RecipeProps {
  recipe: ItemRecipe
  maxQuality: number
}

const Recipe: FC<RecipeProps> = ({ recipe, maxQuality = 1 }) => {
  const isTraderRecipe = recipe.type === "haldor" || recipe.type === "hildir"
  const { data: trader } = useGetItemById(capitalize(recipe.type))
  const { data: coins } = useGetItemById("Coins")
  const { data: killed } = useGetItemById(
    isTraderRecipe ? (recipe.killed ?? "") : ""
  )

  if (recipe.type === "haldor" || recipe.type === "hildir") {
    return (
      <>
        <div className="flex gap-1 items-center">
          You could buy this item from <ItemLink item={trader?.item} />
          for {recipe.value} <ItemLink item={coins?.item} />
        </div>
        {killed && recipe.killed ? (
          <div className="flex gap-1 items-center mt-2">
            Available only after killing <ItemLink item={killed?.item} />
          </div>
        ) : null}
      </>
    )
  }

  return recipe.type !== "craft" ? <></> : <>{maxQuality}</>
}

export default Recipe
