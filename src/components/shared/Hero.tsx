import Search from "./Search"
import { Hammer } from "lucide-react"

const Hero = () => {
  return (
    <div className="relative w-full my-12 mt-0 flex flex-col justify-center items-center text-center">
      {/* Viking-themed background pattern with responsive opacity */}
      <div className="absolute inset-0 bg-[url('/norse-pattern.svg')] opacity-5" />

      {/* Content wrapper with subtle animation */}
      <div className="relative z-10 w-full max-w-4xl px-4 animate-fade-in">
        {/* Decorative elements */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-px w-16 bg-gradient-to-r from-transparent via-border to-transparent" />
          <Hammer
            className="w-8 h-8 text-accent animate-pulse"
            aria-hidden="true"
          />
          <div className="h-px w-16 bg-gradient-to-r from-border to-transparent" />
        </div>

        {/* Main title with responsive text size */}
        <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-norse font-bold mb-6 text-foreground tracking-wider uppercase animate-slide-up">
          Viking Survival Assistant
          <div className="absolute -inset-1 border border-border/20 -z-10 blur-sm rounded-lg" />
        </h1>

        {/* Subtitle with rune-inspired decoration */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary text-center mb-8 font-roboto max-w-2xl mx-auto relative">
          <span className="relative">
            Master Valheim with our comprehensive tools and guides
            <div className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
          </span>
        </p>

        {/* Search container with enhanced styling */}
        <div className="w-full max-w-2xl mx-auto relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent/30 to-accent/20 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000" />
          <div className="relative">
            <Search variant="inline" aria-label="Search tools and guides" />
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="h-px w-32 bg-gradient-to-r from-border to-transparent" />
        </div>
      </div>
    </div>
  )
}

export default Hero
