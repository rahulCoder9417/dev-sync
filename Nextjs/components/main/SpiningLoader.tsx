"use client"

import React from "react"
import clsx from "clsx"

type NewLoaderProps = {
  size?: number // diameter of each dot in px
  colorClass?: string // Tailwind class for background color
  gap?: number // gap in px between dots
  className?: string
}

const NewLoader: React.FC<NewLoaderProps> = ({
  size = 10,
  colorClass = "bg-primary",
  gap = 8,
  className = "",
}) => {
  const styleGap: React.CSSProperties = { gap }

  return (
    <div
      className={clsx("flex items-center justify-center", className)}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
      <div className="flex" style={styleGap}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={clsx("inline-block rounded-full animate-bounce", colorClass)}
            style={{
              width: size,
              height: size,
              animationDelay: `${i * 150}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default NewLoader
