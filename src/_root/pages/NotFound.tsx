import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import React from "react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Particle {
  id: number
  size: number
  top: number
  left: number
  blur: number
  speed: number
  delay: number
  animation: string
  content: string
}

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const generateParticles = (): void => {
      const animations: string[] = [
        "float",
        "floatReverse",
        "float2",
        "floatReverse2",
      ]
      const newParticles: Particle[] = []

      for (let i = 1; i <= 160; i++) {
        const size: number = Math.random() * 20 + 10
        const top: number = Math.random() * 100
        const left: number = Math.random() * 100
        const blur: number = i * 0.02
        const speed: number = Math.random() * 20 + 20
        const delay: number = Math.random() * 1
        const animation: string =
          animations[Math.floor(Math.random() * animations.length)]

        newParticles.push({
          id: i,
          size,
          top,
          left,
          blur,
          speed,
          delay,
          animation,
          content: i <= 40 ? "4" : "0",
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
  }, [])

  const handleGoBack = (): void => {
    navigate("/")
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-foreground font-roboto overflow-hidden w-full">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="absolute pointer-events-none select-none text-muted-foreground"
          style={{
            fontSize: `${particle.size}px`,
            top: `${particle.top}%`,
            left: `${particle.left}%`,
            filter: `blur(${particle.blur}px)`,
            animation: `${particle.speed}s ${particle.animation} infinite`,
            animationDelay: `${particle.delay}s`,
          }}
        >
          {particle.content}
        </span>
      ))}

      <Card className="bg-color-primary-bg border-2 border-accent/10 relative w-[600px] max-w-full m-5 p-8 md:p-10 text-center shadow-lg animate-appear">
        <p className="text-3xl md:text-4xl mb-3 tracking-wider text-foreground font-norse font-bold">
          By Odin's Ravens!
        </p>
        <p className="text-lg md:text-xl mb-4 tracking-wider text-muted-foreground font-roboto">
          You've wandered into the mists of{" "}
          <strong className="text-foreground">404</strong> Niflheim
        </p>
        <Button
          onClick={handleGoBack}
          className="mt-4 py-6 px-8 border-[3px] border-primary bg-transparent hover:bg-accent hover:text-accent-foreground text-[1rem] text-foreground font-bold cursor-pointer transition-colors duration-300"
        >
          Return to Midgard
        </Button>
      </Card>

      <style>{`
        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(100px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(180px);
          }
        }

        @keyframes floatReverse {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-180px);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(28px);
          }
        }

        @keyframes floatReverse2 {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-28px);
          }
        }

        .animate-appear {
          opacity: 0;
          animation: appear 0.8s cubic-bezier(0.39, 0.575, 0.28, 0.995) 0.4s
            forwards;
        }
      `}</style>
    </div>
  )
}

export default NotFoundPage
