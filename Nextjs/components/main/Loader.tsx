'use client'

import React from 'react'
import clsx from 'clsx'

const Loader = ({ length = 4, className = '' }: { length?: number; className?: string }) => {
  return (
    <div className="flex items-center justify-center gap-4">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'relative overflow-hidden rounded-xl  border-primary bg-secondary animate-pulse border w-24 h-24',
            className
          )}
        >
        </div>
      ))}
    
    </div>
  )
}

export default Loader
