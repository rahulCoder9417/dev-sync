"use client"

import { createContext, useContext, useEffect, useState } from "react"

type ShortcutContextType = {
  openSearchPalette: boolean
  setOpenSearchPalette: React.Dispatch<React.SetStateAction<boolean>>

}

const ShortcutContext = createContext<ShortcutContextType | null>(null)

export function ShortcutProvider({ children }: { children: React.ReactNode }) {
  const [openSearchPalette, setOpenSearchPalette] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setOpenSearchPalette((p) => !p)
      }

      if (e.key === "Escape") {
        setOpenSearchPalette(false)
      }
    
    }

    window.addEventListener("keydown", handler, { capture: true })

    return () => {
      window.removeEventListener("keydown", handler, { capture: true })
    }
  }, [])

  return (
    <ShortcutContext.Provider value={{ openSearchPalette, setOpenSearchPalette }}>
      {children}
    </ShortcutContext.Provider>
  )
}

export function useShortcut() {
  const ctx = useContext(ShortcutContext)

  if (!ctx) {
    throw new Error("useShortcut must be inside ShortcutProvider")
  }

  return ctx
}
