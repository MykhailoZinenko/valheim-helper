import { createContext, useContext, useEffect, useState } from "react"

type Theme =
  | "dark"
  | "light"
  | "light-ocean"
  | "midnight-azure"
  | "light-sand"
  | "dark-forest"
  | "sakura-bloom"
  | "system"

const themeKeys = {
  dark: "Dark",
  light: "Light",
  "light-ocean": "Light Ocean",
  "midnight-azure": "Midnight Azure",
  "light-sand": "Warm Sand",
  "dark-forest": "Forest Night",
  "sakura-bloom": "Sakura Bloom",
  system: "System",
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  themeKeys: { [key: string]: string }
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  themeKeys,
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  useEffect(() => {
    const root = window.document.documentElement

    Object.keys(themeKeys).forEach((key) => {
      if (key === "system") return
      root.classList.remove(key)
    })

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    themeKeys,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
