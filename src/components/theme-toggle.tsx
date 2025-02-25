import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { setTheme } from "../lib/utils"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [theme, setThemeState] = React.useState<"light" | "dark">("dark")

  React.useEffect(() => {
    // Initialize theme
    const root = window.document.documentElement
    if (!root.classList.contains("light") && !root.classList.contains("dark")) {
      root.classList.add("dark")
    }
    setThemeState(root.classList.contains("dark") ? "dark" : "light")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setThemeState(newTheme)
    setTheme(newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className={`rounded-md p-2 ${className || ''}`}
      aria-label="Toggle theme"
      style={{ 
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {theme === "light" ? (
        <Moon style={{ width: '20px', height: '20px', color: '#374151' }} />
      ) : (
        <Sun style={{ width: '20px', height: '20px', color: '#fde047' }} />
      )}
    </button>
  )
} 