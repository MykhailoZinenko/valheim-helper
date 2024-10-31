import BiomesSlider from "@/components/shared/BiomesSlider"
import Features from "@/components/shared/Features"
import Hero from "@/components/shared/Hero"
import Loader from "@/components/shared/Loader"
import QuickTools from "@/components/shared/QuickTools"
import {
  useGetBiomes,
  useGetItems,
} from "@/lib/react-query/queriesAndMutations"

const Home = () => {
  const { data: items, isLoading: isItemsLoading } = useGetItems()
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
      <BiomesSlider data={biomes ?? { total: 0, biomes: [] }} />
      {/* <Features itemsLength={items?.total} /> */}
    </div>
  )
}

export default Home
