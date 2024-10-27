type Size = "sm" | "md" | "lg"

const Loader = ({
  size = "md",
  message = "",
}: {
  size?: Size
  message?: string
}) => {
  const sizes: Record<Size, string> = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-28 h-28",
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative ${sizes[size]}`}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Main flame group */}
          <g className="animate-flicker">
            {/* Outer flame */}
            <path
              d="M50 10 
                 C30 40 20 50 35 75
                 C40 85 60 85 65 75
                 C80 50 70 40 50 10"
              fill="#1a1a1a"
              className="opacity-40 animate-flame-outer"
            />

            {/* Middle flame */}
            <path
              d="M50 20
                 C35 45 30 55 40 75
                 C45 82 55 82 60 75
                 C70 55 65 45 50 20"
              fill="#262626"
              className="animate-flame-middle"
            />

            {/* Inner flame */}
            <path
              d="M50 30
                 C40 50 38 60 45 75
                 C48 78 52 78 55 75
                 C62 60 60 50 50 30"
              fill="#00b3b3"
              className="animate-flame-inner opacity-90"
            />

            {/* Core */}
            <path
              d="M50 40
                 C45 55 43 65 48 73
                 C49 75 51 75 52 73
                 C57 65 55 55 50 40"
              fill="#00ffff"
              className="animate-flame-core opacity-70"
            />
          </g>
        </svg>
      </div>

      {message && (
        <span className="text-[#00b3b3] text-sm animate-pulse font-viking">
          {message}
        </span>
      )}

      <style>{`
        @keyframes flicker {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes flameOuter {
          0%,
          100% {
            transform: scale(1) rotate(0deg);
          }
          50% {
            transform: scale(1.05) rotate(3deg);
          }
        }

        @keyframes flameMiddle {
          0%,
          100% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateX(2px) scale(1.03);
          }
        }

        @keyframes flameInner {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-2px) scale(1.05);
            opacity: 1;
          }
        }

        @keyframes flameCore {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.1);
            opacity: 1;
          }
        }

        .animate-flicker {
          animation: flicker 2s ease-in-out infinite;
        }

        .animate-flame-outer {
          animation: flameOuter 3s ease-in-out infinite;
        }

        .animate-flame-middle {
          animation: flameMiddle 2s ease-in-out infinite;
        }

        .animate-flame-inner {
          animation: flameInner 1.5s ease-in-out infinite;
        }

        .animate-flame-core {
          animation: flameCore 1s ease-in-out infinite;
        }

        .font-viking {
          font-family: "Noto Sans", system-ui, sans-serif;
          letter-spacing: 0.05em;
        }
      `}</style>
    </div>
  )
}

export default Loader
