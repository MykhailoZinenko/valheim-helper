import DataTable from "@/components/shared/DataTable"
import ItemLink from "@/components/shared/ItemLink"
import Loader from "@/components/shared/Loader"
import CreaturesTable from "@/components/shared/tables/CreaturesTable"
import FoodTable from "@/components/shared/tables/FoodTable"
import VignetteImage from "@/components/shared/VignetteImage"
import { useGetBiomeById } from "@/lib/react-query/queriesAndMutations"
import { cn } from "@/lib/utils"
import { type Biome } from "@/types"
import { useParams } from "react-router-dom"

const Biome = () => {
  const { id } = useParams()

  const {
    data: biome,
    isPending,
    isError,
  } = useGetBiomeById((id as Biome) || "Meadows")

  return (
    <>
      {isPending || isError ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <div>
          <div className="flex flex-col-reverse gap-8 py-8 md:flex-row md:items-center md:gap-4">
            <div className="w-full md:w-4/5 md:mt-5">
              <h1 className="text-5xl font-norse font-bold text-color-text-primary">
                {biome.name}
              </h1>
              <h3 className="text-xl text-color-text-secondary">
                {biome.description}
              </h3>
            </div>
            <div className="w-full h-[250px] relative z-0 transition-transform duration-700 ease-out transform">
              <VignetteImage
                src={biome.imageUrl}
                fromColor="from-color-primary-bg"
                fromPercent="from-[0%]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full md:mx-auto py-8">
            {biome.resources.items
              .sort((a, b) =>
                a.item.readableName.localeCompare(b.item.readableName)
              )
              .map((item) => {
                return (
                  <ItemLink
                    item={item.item}
                    className="w-full"
                    variant="filled"
                  />
                )
              })}
          </div>
          <CreaturesTable data={biome.creatures.items} />

          <FoodTable data={biome.food.items} />
        </div>
      )}
    </>
  )
}

export default Biome
