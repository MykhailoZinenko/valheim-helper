import { cn } from "@/lib/utils"

interface VignetteImageProps {
  src: string
  variant?: "inline" | "absolute"
  fromColor?: string
  fromPercent?: string
}

const VignetteImage: React.FC<VignetteImageProps> = ({
  src,
  variant = "inline",
  fromColor = "from-black",
  fromPercent = "-25%",
}) => {
  // Construct the gradient style with dynamic percentage
  const gradientStyle = cn(
    "absolute inset-0",
    "via-transparent to-transparent to-[50%]",
    fromColor,
    fromPercent
  )

  return (
    <div
      className={cn(
        "top-0 left-0 w-full h-full overflow-hidden",
        variant === "inline" ? "relative" : "absolute",
        variant === "inline" ? "z-0" : "z-[-1]"
      )}
    >
      <img
        src={src}
        alt="Background image"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/0" />

      {/* Gradient overlays */}
      <div className={cn(gradientStyle, "bg-gradient-to-t")} />
      <div className={cn(gradientStyle, "bg-gradient-to-tr")} />
      <div className={cn(gradientStyle, "bg-gradient-to-tl")} />
      <div className={cn(gradientStyle, "bg-gradient-to-b")} />
      <div className={cn(gradientStyle, "bg-gradient-to-br")} />
      <div className={cn(gradientStyle, "bg-gradient-to-bl")} />
      <div className={cn(gradientStyle, "bg-gradient-to-r")} />
      <div className={cn(gradientStyle, "bg-gradient-to-l")} />
    </div>
  )
}

export default VignetteImage
