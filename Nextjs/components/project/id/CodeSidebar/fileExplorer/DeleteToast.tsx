"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"

interface DeleteToastProps {
  fileName: string
  fileId:string
  confirm?: () => void
  done:string[]
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
  const progress = Math.min((done.length  / total) * 100, 100)
let userId = useAppSelector((state) => state.user.id)
const [click, setclick] = useState(false)
  // Auto-dismiss when done
  useEffect(() => {
    if(done && Array.isArray(done) && done.includes(userId)){
      setclick(true)
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
            className="text-gray-400 hover:text-white text-xs cursor-pointer" 
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
              {done.length}/{total} confirmed
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
          {( !click)&& <button onClick={()=>{confirm!();done.push(userId);setclick(true)}} className="text-xs text-gray-400 cursor-pointer mt-1">Confirm</button>}
        </div>
      </div>
    </div>
  )
}
