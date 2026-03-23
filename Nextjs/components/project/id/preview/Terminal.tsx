"use client"
import React, { useEffect, useRef, useState } from "react"
import { Terminal as XTerminal } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import "xterm/css/xterm.css"
import { useAppSelector } from "@/lib/redux/hooks"
import useTerminal from "@/customHooks/useTerminal"
import { showToast } from "@/components/main/Toast"

type PortInfo = { port: string; token: string }

type Shortcut = {
  id: string
  label: string
  command: string
}

type TerminalProps = {
  setIframeUrl?: (url: string) => void
  className?: string
  projectId?: string
  projectName?: string
}

const Terminal: React.FC<TerminalProps> = ({ 
  setIframeUrl, 
  className = "", 
  projectId = "",
  projectName = ""
}) => {
  const terminalRef = useRef<HTMLDivElement | null>(null)
  const fitAddonRef = useRef<FitAddon | null>(null)
  const termRef = useRef<XTerminal | null>(null)
  const [ports, setPorts] = useState<PortInfo[]>([])
  const [showGUI, setShowGUI] = useState(false)
  const userId = useAppSelector((state) => state.user.id)

  // Shortcuts state
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([
    { id: "1", label: "npm start", command: "npm start" },
    { id: "2", label: "npm install", command: "npm install" },
    { id: "3", label: "Clear", command: "clear" },
  ])
  const [showShortcutDialog, setShowShortcutDialog] = useState(false)
  const [newShortcut, setNewShortcut] = useState({ label: "", command: "" })
  const [showRunMenu, setShowRunMenu] = useState(false)
  const [selectedCommand, setSelectedCommand] = useState("npm start")
  const runMenuRef = useRef<HTMLDivElement>(null)
  const [showHelpDialog, setShowHelpDialog] = useState(false)

  const { status, start, input, resize, stop, disconnect } = useTerminal({
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
    projectId: projectId,
    termRef: termRef,
  })

  const safeFit = () => {
    const fit = fitAddonRef.current
    const term = termRef.current
    const el = terminalRef.current

    if (!fit || !term || !el) return

    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) return

    try {
      // Check if terminal is open before fitting
      if (term.element && term.element.offsetParent !== null) {
        fit.fit()
        resize(term.cols, term.rows)
      }
    } catch (error) {
      console.warn('Fit addon error:', error)
    }
  }

  // Execute command in terminal
  const executeCommand = (command: string) => {
    if (!termRef.current) return
    
    // Type the command
    input(command)
    // Send enter key
    input('\r')
  }

  // Add new shortcut
  const addShortcut = () => {
    if (!newShortcut.label || !newShortcut.command) return
    
    const shortcut: Shortcut = {
      id: Date.now().toString(),
      label: newShortcut.label,
      command: newShortcut.command,
    }
    
    setShortcuts([...shortcuts, shortcut])
    setNewShortcut({ label: "", command: "" })
    setShowShortcutDialog(false)
  }

  // Delete shortcut
  const deleteShortcut = (id: string) => {
    setShortcuts(shortcuts.filter(s => s.id !== id))
  }

  // Close run menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (runMenuRef.current && !runMenuRef.current.contains(event.target as Node)) {
        setShowRunMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    return () => {
      stop()
      disconnect()
    }
  }, [])

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

  useEffect(() => {
    const el = terminalRef.current
    if (!el) return

    const handler = () => safeFit()
    el.addEventListener("transitionend", handler)

    return () => el.removeEventListener("transitionend", handler)
  }, [showGUI])

  const API_URL = (process.env.NODE_ENV === "development" ? "http" : "https") + process.env.NEXT_PUBLIC_WS_URL_TERMINAL
  
  const guiURL = `${API_URL}/gui/${encodeURIComponent(userId || "")}`

  const openPreview = (p: PortInfo) => {
    const url = `${API_URL}/preview/${encodeURIComponent(
      userId || ""
    )}/${encodeURIComponent(p.port)}?token=${encodeURIComponent(p.token)}`

    if (setIframeUrl) setIframeUrl(url)
    else window.open(url, "_blank")
   const previewHost = `${userId}-${p.port}.dev.example.dev`;
  const nurl = `https://${previewHost}`;

  window.open(nurl, "_blank");
  }

  return (
    <div className={`${className} h-full w-full flex flex-col`}>
      {/* Top Control Bar */}
      <div className="px-3 py-1.5 bg-neutral-900 border-b border-neutral-700 flex gap-2 items-center">
        {/* Run Button with Dropdown */}
        <div className="relative" ref={runMenuRef}>
          <button
            className="bg-green-700 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-2 border border-green-600"
            onContextMenu={(e) => {
              e.preventDefault()
              setShowRunMenu(!showRunMenu)
            }}
            onClick={() => executeCommand(selectedCommand)}
            title={`Right-click to change command • Current: ${selectedCommand}`}
          >
            <span>▶</span>
            <span className="font-medium">Run</span>
          </button>

          {/* Run Menu Dropdown */}
          {showRunMenu && (
            <div className="absolute top-full left-0 mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-50 min-w-48">
              <div className="p-2 border-b border-neutral-700">
                <p className="text-neutral-400 text-xs">Select command:</p>
              </div>
              
              {shortcuts.map((shortcut) => (
                <button
                  key={shortcut.id}
                  className="w-full text-left px-3 py-2 text-white text-sm hover:bg-neutral-700 flex items-center gap-2"
                  onClick={() => {
                    setSelectedCommand(shortcut.command)
                    setShowRunMenu(false)
                  }}
                >
                  <span className={selectedCommand === shortcut.command ? "text-green-500" : "text-neutral-500"}>
                    {selectedCommand === shortcut.command ? "✓" : "○"}
                  </span>
                  <span>{shortcut.label}</span>
                </button>
              ))}
              
              <div className="border-t border-neutral-700">
                <button
                  className="w-full text-left px-3 py-2 text-violet-400 text-sm hover:bg-neutral-700"
                  onClick={() => {
                    setShowShortcutDialog(true)
                    setShowRunMenu(false)
                  }}
                >
                  + Add Custom Command
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Open GUI Button */}
        <button
          className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded text-sm border border-neutral-600"
          onClick={() => window.open(guiURL, "_blank")}
          title="Open GUI in new tab"
        >
          🖥️ GUI
        </button>

        {/* Show Web Project Button */}
          <button
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded text-sm border border-neutral-600"
            onClick={() => {
              const url = `${API_URL}/projects/${projectId}/${projectName}`
              window.open(url, "_blank")
            }}
            title="Open web project"
          >
            🌐 Project
          </button>

        {/* Show help */}
        <div className="relative">
  <button
    className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded text-sm border border-neutral-600"
    onClick={() => setShowHelpDialog((prev) => !prev)}
    title="Show help"
  >
    ?
  </button>

  {showHelpDialog && (
    <div className="absolute right-0 top-full mt-2 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-50 w-72">
      <div className="bg-violet-900/20 p-4 rounded border border-violet-700">
        <h4 className="text-violet-300 font-semibold mb-2">💡 Tips</h4>
        <ul className="text-neutral-300 text-sm space-y-1 list-disc list-inside">
          <li>Add custom commands by right-clicking the Run button</li>
          <li>If using gui,after running gui command click on open gui button </li>
          <li>For basic html css js project use open project button</li>
          <li>Ports are auto-detected when you start a dev server</li>
          <li>dev server for vite are not allowed use by building then preview</li>
        </ul>
      </div>

      <button
        className="mt-3 w-full bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded"
        onClick={() => setShowHelpDialog(false)}
      >
        Got it!
      </button>
    </div>
  )}
</div>
</div>

      {/* Shortcut Dialog */}
      {showShortcutDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 w-96">
            <h3 className="text-white text-lg font-semibold mb-4">Add New Shortcut</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm block mb-1">Label</label>
                <input
                  type="text"
                  className="w-full bg-neutral-900 text-white px-3 py-2 rounded border border-neutral-700 focus:border-violet-600 focus:outline-none"
                  placeholder="e.g., npm start"
                  value={newShortcut.label}
                  onChange={(e) => setNewShortcut({ ...newShortcut, label: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-white text-sm block mb-1">Command</label>
                <input
                  type="text"
                  className="w-full bg-neutral-900 text-white px-3 py-2 rounded border border-neutral-700 focus:border-violet-600 focus:outline-none"
                  placeholder="e.g., npm start"
                  value={newShortcut.command}
                  onChange={(e) => setNewShortcut({ ...newShortcut, command: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && addShortcut()}
                />
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                className="flex-1 bg-violet-700 hover:bg-violet-600 text-white px-4 py-2 rounded"
                onClick={addShortcut}
              >
                Add
              </button>
              <button
                className="flex-1 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  setShowShortcutDialog(false)
                  setNewShortcut({ label: "", command: "" })
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal */}
      <div
        ref={terminalRef}
        className={`w-full bg-neutral-900 transition-all flex-1`}
        data-status={status}
      />

      {/* Detected Servers */}
      <div className="px-3 py-1.5 bg-neutral-950 text-white border-t border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 text-xs">Ports:</span>
          
          {ports.length === 0 ? (
            <span className="text-neutral-500 text-xs">None detected</span>
          ) : (
            <div className="flex gap-2">
              {ports.map((p) => (
                <button
                  key={p.port}
                  className="bg-neutral-800 hover:bg-neutral-700 px-2 py-0.5 text-xs rounded border border-neutral-700"
                  onClick={() => openPreview(p)}
                  title={`Open preview on port ${p.port}`}
                >
                  {p.port}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Terminal