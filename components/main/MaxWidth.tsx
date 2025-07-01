import React from 'react'
import { cn } from '@/lib/utils'
const MaxWidth = ({children, className}: {children: React.ReactNode, className?: string}) => {
  return (
    <div className={cn('min-h-screen flex w-full mx-auto', className)}>
        {children}
    </div>
  )
}

export default MaxWidth