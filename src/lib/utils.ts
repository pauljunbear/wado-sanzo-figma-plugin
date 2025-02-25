export function getSystemTheme(): "dark" | "light" {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return "dark" // Default to dark theme
}

export function setTheme(theme: "dark" | "light" | "system") {
  const root = window.document.documentElement
  
  root.classList.remove("light", "dark")
  
  if (theme === "system") {
    const systemTheme = getSystemTheme()
    root.classList.add(systemTheme)
    return
  }
  
  root.classList.add(theme)
} 