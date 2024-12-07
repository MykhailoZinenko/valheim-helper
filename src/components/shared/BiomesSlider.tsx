import React, { useState, useEffect } from "react"
import { Card, CardContent } from "../ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "../ui/carousel"
import VignetteImage from "./VignetteImage"
import { IBiome, IItem, IResponse } from "@/types"
import { Link } from "react-router-dom"
import { Shield } from "lucide-react"

interface BiomesSliderProps {
  data: IResponse<IItem<IBiome>>
}

const BiomesSlider: React.FC<BiomesSliderProps> = ({ data }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!carouselApi) return

    setCurrentSlide(carouselApi.selectedScrollSnap())
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    })
  }, [carouselApi])

  const handleDotClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index)
      setCurrentSlide(index)
    }
  }

  return (
    <div className="w-full space-y-6 py-8">
      {/* Main Carousel */}
      <Carousel
        setApi={setCarouselApi}
        className="w-full grid sm:grid-cols-[auto_1fr_auto] gap-4"
      >
        <CarouselPrevious className="relative left-0 h-12 w-12 border-2 border-accent/20 hover:border-accent/50 transition-colors hidden sm:flex" />
        <CarouselContent className="-m-0.5">
          {data.items.map((biome, index) => (
            <CarouselItem key={index} className="p-1">
              <Card className="bg-color-primary-bg border-2 border-accent/10 hover:border-accent/20 transition-all duration-300">
                <CardContent className="flex h-[450px] items-center justify-center p-8 relative overflow-hidden">
                  {/* Background Image with Vignette */}
                  <div className="w-3/5 h-full absolute left-0 top-0 z-[0] md:relative md:z-0 transition-transform duration-700 ease-out transform hover:scale-105">
                    <VignetteImage
                      src={biome.imageUrl}
                      fromColor="from-color-primary-bg"
                      fromPercent="from-[0%]"
                    />
                  </div>

                  {/* Content */}
                  <div className="w-full md:w-2/5 rounded-2xl h-max px-8 py-6 bg-color-primary-bg/80 backdrop-blur-sm border border-accent/10 transform transition-all duration-300 hover:scale-[1.02]">
                    {/* Title */}
                    <Link
                      to={`/biome/${biome.name}`}
                      className="group inline-block"
                    >
                      <h3 className="text-4xl font-norse font-bold text-color-text-primary group-hover:text-color-link transition-colors duration-300">
                        {biome.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="text-md text-color-text-secondary text-balance mt-4 leading-relaxed">
                      {biome.description}
                    </p>

                    {/* Bosses Section */}
                    {biome.bosses.items?.length > 0 && (
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-accent mb-[5px]" />
                          <h4 className="text-2xl font-norse font-bold">
                            Bosses
                          </h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          {biome.bosses.items.map((creature) => (
                            <Link
                              key={creature.item.readableName}
                              to={`/item/${creature.item.id}`}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/10 transition-colors group"
                            >
                              <img
                                src={creature.item.icon}
                                height={32}
                                width={32}
                                loading="lazy"
                                className="transform transition-transform group-hover:scale-110"
                              />
                              <span className="group-hover:text-color-link transition-colors">
                                {creature.item.readableName}
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="relative right-0 h-12 w-12 border-2 border-accent/20 hover:border-accent/50 transition-colors hidden sm:flex" />
      </Carousel>

      {/* Pagination Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {data.items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-8 bg-accent"
                : "bg-accent/20 hover:bg-accent/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={currentSlide === index ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  )
}

export default BiomesSlider
