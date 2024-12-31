import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import AuthProvider from "./context/AuthContext.tsx"
import { QueryProvider } from "./lib/react-query/QueryProvider.tsx"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ThemeProvider } from "./components/providers/theme-provider.tsx"
import { CalculatorProvider } from "./context/CalculatorContext.tsx"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <BrowserRouter>
      <QueryProvider>
        <AuthProvider>
          <CalculatorProvider>
            <App />
          </CalculatorProvider>
        </AuthProvider>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryProvider>
    </BrowserRouter>
  </ThemeProvider>
)
