'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-primary text-primary flex flex-col items-center justify-center px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-extrabold mb-8 text-[--brand-primary]"
      >
        Dev<span className="text-[--brand-accent]">Sync</span> <span className="text-[--brand-secondary]">AI</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-[--text-secondary] text-center max-w-xl mb-12"
      >
        Seamless AI-powered development. Collaborate, sync, and build with real-time magic.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="flex gap-4 flex-wrap justify-center"
      >
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-2xl bg-[--brand-primary] text-white hover:bg-[--brand-secondary] transition shadow-lg"
        >
          Dashboard
        </Link>
        <Link
          href="/sign-in"
          className="px-6 py-3 rounded-2xl bg-[--bg-card] border border-[--border-secondary] text-[--text-primary] hover:bg-[--bg-hover] transition shadow"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-6 py-3 rounded-2xl bg-[--bg-card] border border-[--border-secondary] text-[--text-primary] hover:bg-[--bg-hover] transition shadow"
        >
          Sign Up
        </Link>
      </motion.div>
    </main>
  )
}
