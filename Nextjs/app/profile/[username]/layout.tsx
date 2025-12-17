import { DashboardSidebar } from "@/components/sidebar/DashboardSidebar"
import HeaderHome from "@/components/dashboard/HeaderHome"
import React from "react"
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-full max-md:flex-col">
          {/* sidebar/ */}
    <DashboardSidebar/>
        <div className="hidden max-md:block"> <HeaderHome /></div>
      {children}</div>
  )
}

export default layout