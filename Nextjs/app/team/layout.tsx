import { DashboardSidebar } from "@/components/sidebar/DashboardSidebar"
import HeaderHome from "@/components/root/HeaderHome"
import React from "react"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-full h-auto min-w-full">
        <div className="hidden max-md:block"> <HeaderHome /></div>
          {/* sidebar/ */}
    <DashboardSidebar/>
      {children}
      </div>
  )
}

export default layout