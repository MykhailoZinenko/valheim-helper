import React from "react"
import { Compass, ArrowRight, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import APIBlock from "./APIBlock"
import VignetteImage from "./VignetteImage"

const Features = () => {
  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    // Create and dispatch a keyboard event for Ctrl/Cmd + K
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
    const event = new KeyboardEvent("keydown", {
      key: "k",
      code: "KeyK",
      ctrlKey: !isMac,
      metaKey: isMac,
      bubbles: true,
    })
    document.dispatchEvent(event)
  }

  return (
    <div className="w-full max-w-7xl mx-auto py-16 space-y-32 px-4">
      {/* App Feature Block */}
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-accent">
            <Compass className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Explore
            </span>
          </div>

          <h2 className="text-4xl font-norse font-bold">
            Your Ultimate Viking Companion
          </h2>

          <p className="text-lg text-color-text-secondary leading-relaxed">
            Navigate through Valheim's vast world with confidence. Our
            comprehensive guides, interactive maps, and resource calculators
            help you master every biome, craft the perfect gear, and conquer any
            challenge.
          </p>

          <Button
            className="group"
            variant="outline"
            size="lg"
            onClick={handleExploreClick}
          >
            Start Exploring
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="relative h-[400px] md:h-[300px] w-full rounded-2xl overflow-hidden">
          <VignetteImage
            src="/assets/images/app-interface.jpg"
            fromColor="from-color-primary-bg"
            fromPercent="from-[0%]"
          />
        </div>
      </div>

      {/* API Feature Block */}
      <div className="grid md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
        <div className="md:order-2 space-y-6">
          <div className="flex items-center gap-2 text-accent">
            <Code className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">
              API
            </span>
          </div>

          <h2 className="text-4xl font-norse font-bold">Power Your Projects</h2>

          <p className="text-lg text-color-text-secondary leading-relaxed">
            Access our comprehensive Valheim data through our robust API. Build
            tools, enhance your applications, or create unique experiences for
            the community.
          </p>

          <APIBlock
            method="GET"
            endpoint="/api/v1/biomes/meadows"
            example={{
              response: JSON.stringify(
                {
                  name: "Meadows",
                  creatures: ["Eikthyr", "Boar", "Neck"],
                  resources: ["Wood", "Stone", "Flint"],
                  difficulty: 1,
                },
                null,
                2
              ),
            }}
          />

          <Button className="group" variant="outline" size="lg">
            View API Documentation
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        <div className="md:order-1 relative">
          <div className="relative h-[400px] md:h-[600px] w-full rounded-2xl overflow-hidden">
            <VignetteImage
              src="/assets/images/api-documentation.jpg"
              fromColor="from-color-primary-bg"
              fromPercent="from-[0%]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features
