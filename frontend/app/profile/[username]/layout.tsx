import { DashboardSidebar } from "@/components/root/DashboardSidebar"
import HeaderHome from "@/components/root/HeaderHome"
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