'use client'

import React from 'react'
import clsx from 'clsx'

const Loader = ({ length = 4, className = '' }: { length?: number; className?: string }) => {
  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 100% 0;
          }
        }

        .shimmer-card {
          background: linear-gradient(
            110deg,
            #0d0d1f 8%,
            #1a1a3c 18%,
            #0d0d1f 33%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>

      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            ' rounded-xl border shimmer-card',
            className
          )}
          style={{ borderColor: 'var(--border-primary)' }}
        />
      ))}
    </>
  )
}

export default Loader
