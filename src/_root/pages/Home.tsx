import BiomesSlider from "@/components/shared/BiomesSlider"
import Hero from "@/components/shared/Hero"
import Loader from "@/components/shared/Loader"
import { useGetBiomes } from "@/lib/react-query/queriesAndMutations"

const Home = () => {
  const { data: biomes, isPending, isError } = useGetBiomes()

  return isPending || isError ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="w-full h-full text-color-text-primary">
      {/* Hero Section */}
      <Hero />
      {/* <QuickTools /> */}
      <BiomesSlider data={biomes} />
      {/* <Features itemsLength={items?.total} /> */}
    </div>
  )
}

export default Home
