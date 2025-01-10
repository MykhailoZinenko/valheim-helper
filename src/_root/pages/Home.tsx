import BiomesSlider from "@/components/shared/BiomesSlider"
import Features from "@/components/shared/Features"
import Hero from "@/components/shared/Hero"
import Loader from "@/components/shared/Loader"
import QuoteBlock from "@/components/shared/QuoteBlock"
import { useGetBiomes } from "@/lib/react-query/queriesAndMutations"

const Home = () => {
  const { data: biomes, isPending, isError } = useGetBiomes()

  return isPending || isError ? (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="lg" />
    </div>
  ) : (
    <div className="h-full text-color-text-primary">
      {/* Hero Section */}
      <Hero />
      {/* <QuickTools /> */}
      <BiomesSlider data={biomes} />
      <Features />
      <QuoteBlock />
    </div>
  )
}

export default Home
