"use client"
import React, { useEffect, useRef, useState } from "react"
import { Terminal as XTerminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"
import { useAppSelector } from "@/lib/redux/hooks"
import useTerminal from "@/customHooks/useTerminal"
import { randomUUID } from "crypto"

type PortInfo = { port: string; token: string }

type TerminalProps = {
  setIframeUrl?: (url: string) => void
  className?: string
  projectId?: string
}

const Terminal: React.FC<TerminalProps> = ({ setIframeUrl, className = "" ,projectId = ""}) => {
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const termRef = useRef<XTerminal | null>(null)
  const [ports, setPorts] = useState<PortInfo[]>([])
  const [showGUI, setShowGUI] = useState(false)
  const userId = useAppSelector((state) => state.user.id)


  const { status, start, input, resize, stop } = useTerminal({
    onMessage: (payload: any) => {
      const term = termRef.current
      if (!term) return

      if (payload && typeof payload === "object" && "type" in payload) {
        switch (payload.type) {
          case "output":
            if (typeof payload.data === "string") {
              if (payload.data.startsWith("PREVIEW:")) {
                const [port, token] = payload.data.replace("PREVIEW:", "").split(":")
                if (port) {
                  setPorts((prev) => {
                    if (prev.some((p) => p.port === port)) return prev
                    return [...prev, { port, token: token ?? "" }]
                  })
                }
                return
              }
              term.write(payload.data)
            }
            return

          case "started":
            term.write(`✔ Connected\r\n`)
            return

          case "exit":
            term.write(`\r\n[Session ended]\r\n`)
            return

          default:
            if ((payload as any).error) {
              term.write(`\r\n[Error] ${(payload as any).error}\r\n`)
            }
            return
        }
      }
    },
    projectId: projectId
  })

  // Prevent xterm crash by ensuring element has real size
  const safeFit = () => {
    const fit = fitAddonRef.current
    const term = termRef.current
    const el = terminalRef.current

    if (!fit || !term || !el) return

    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return

    fit.fit()
    resize(term.cols, term.rows)
  }

  useEffect(() => {
    if (!terminalRef.current) return

    const fitAddon = new FitAddon()
    fitAddonRef.current = fitAddon

    const term = new XTerminal({
      cursorBlink: true,
      fontSize: 14,
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
      },
    })

    termRef.current = term
    term.loadAddon(fitAddon)

    term.open(terminalRef.current)

    // Fit after DOM is fully painted
    setTimeout(() => safeFit(), 0)

    start(term.cols, term.rows)

    term.onData((data: string) => input(data))

    const handleResize = () => safeFit()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      stop()
      term.dispose()
    }
  }, [start, input, resize, stop])

  // Fit after any UI transitions
  useEffect(() => {
    const el = terminalRef.current
    if (!el) return

    const handler = () => safeFit()
    el.addEventListener("transitionend", handler)

    return () => el.removeEventListener("transitionend", handler)
  }, [showGUI])

  const API_URL = process.env.NEXT_PUBLIC_BASE_URL || ""
  const guiURL = `${API_URL}/gui/${encodeURIComponent(userId || "")}`

  const openPreview = (p: PortInfo) => {
    const url = `${API_URL}/preview/${encodeURIComponent(
      userId || ""
    )}/${encodeURIComponent(p.port)}?token=${encodeURIComponent(p.token)}`

    if (setIframeUrl) setIframeUrl(url)
    else window.open(url, "_blank")
  }

  return (
    <div className={`${className} h-full flex flex-col`}>
      <div
        ref={terminalRef}
        className={`${"flex-1"} bg-neutral-900 transition-all`}
        data-status={status}
      />

      <div className="px-3 py-2 bg-neutral-900 text-white flex flex-1 gap-2">
        <button
          className="bg-neutral-800 h-12 hover:bg-neutral-700 px-4 py-2 rounded border border-neutral-700"
          onClick={() => window.open(guiURL, "_blank")}
        >
          Open GUI in New Tab
        </button>

        <button
          className={`px-4 py-2 rounded h-12 border ${
            showGUI
              ? "bg-violet-700 border-violet-600"
              : "bg-neutral-800 border-neutral-700"
          } hover:opacity-90`}
          onClick={() => setShowGUI((s) => !s)}
        >
          {showGUI ? "Hide GUI" : "Show GUI Below"}
        </button>
      </div>

      {showGUI && (
        <iframe src={guiURL} className="w-full h-[40vh] border-0 bg-black" />
      )}

      <div className="px-3 py-2 bg-neutral-950 text-white">
        <h3 className="mb-2 font-semibold">Detected Servers:</h3>

        {ports.length === 0 && (
          <p className="text-neutral-400">No dev server detected yet</p>
        )}

        <div className="flex flex-wrap gap-2">
          {ports.map((p) => (
            <button
              key={p.port}
              className="bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded border border-neutral-700"
              onClick={() => openPreview(p)}
            >
              Open Preview: {p.port}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Terminal