import { DashboardSidebar } from "@/components/root/DashboardSidebar"
import React from "react"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-full">
          {/* sidebar/ */}
    <DashboardSidebar/>
      {children}
      </div>
  )
}

export default layout