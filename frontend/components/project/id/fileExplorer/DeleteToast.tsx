"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useAppDispatch } from "@/lib/redux/hooks"

interface DeleteToastProps {
  fileName: string
  fileId:string
  confirm?: () => void
  done:number
  total: number
  fullName:string
  setdeletionMenu: (menu: any) => void
  projectId:string
}

export function DeleteToast({
  fileName,
  fileId,
  done,
  total,
  confirm,
  setdeletionMenu,
  fullName,
  projectId,
}: DeleteToastProps) {
  const progress = Math.min((done  / total) * 100, 100)

  // Auto-dismiss when done
  useEffect(() => {
    if (done >= total) {
      const timer = setTimeout(() => {
        setdeletionMenu(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [done, total])
if(!done)return null
  return (
    <div className="fixed z-50 top-4 left-4 w-72 bg-[#242937] text-white shadow-lg rounded-2xl overflow-hidden border border-[#374151]">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <p className="font-medium text-sm truncate">
            Deleting: <span className="text-brand-primary">{fileName}</span>
          </p>
          <button
            onClick={()=>setdeletionMenu(null)}
            className="text-gray-400 hover:text-white text-xs"
          >
            ✕
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Started by  </p> <span className="text-gray-200">{fullName}</span>
      

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1 text-gray-400">
            <span>
              {done}/{total} confirmed
            </span>
          </div>
          <div className="h-2 bg-[#2d3348] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.5 }}
              className="h-2 bg-red-500"
            />
          </div>
          {confirm && <button onClick={confirm} className="text-xs text-gray-400 mt-1">Confirm</button>}
        </div>
      </div>
    </div>
  )
}
