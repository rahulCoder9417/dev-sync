// app/providers.tsx
'use client'

import { Toaster } from '@/components/ui/sonner'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {

  return (
    <>
      {children}
      
      <Toaster
  richColors
  closeButton
  position="top-right"
  toastOptions={{
    classNames: {
      toast: "rounded-xl shadow-lg border",
      title: "text-base font-semibold",
      description: "text-sm opacity-90",
    },
  }}
/>
      </>
  )
}
