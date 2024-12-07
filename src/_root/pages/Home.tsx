import BiomesSlider from "@/components/shared/BiomesSlider"
import Hero from "@/components/shared/Hero"
import Loader from "@/components/shared/Loader"
import {
  useGetBiomes,
  useGetItems,
} from "@/lib/react-query/queriesAndMutations"

const Home = () => {
  const { isLoading: isItemsLoading } = useGetItems()
  const { data: biomes, isLoading: isBiomesLoading } = useGetBiomes()

  return isItemsLoading || isBiomesLoading ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="w-full h-full text-color-text-primary">
      {/* Hero Section */}
      <Hero />
      {/* <QuickTools /> */}
      <BiomesSlider data={biomes ?? { total: 0, items: [] }} />
      {/* <Features itemsLength={items?.total} /> */}
    </div>
  )
}

export default Home
