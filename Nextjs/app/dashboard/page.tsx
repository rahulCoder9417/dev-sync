export const dynamic = "force-dynamic";

import MaxWidth from "@/components/main/MaxWidth";
import HeaderHome from "@/components/root/HeaderHome";
import { QuickActions } from "@/components/root/QuickActions";
import { RecentProjects } from "@/components/root/RecentProjects";
import { StatsCards } from "@/components/root/StatsCards";
import { Suspense } from "react";
import Loader from "@/components/main/Loader";
export default function Dashboard() {
  return (
   <MaxWidth className="bg-[var(--bg-primary)] ">


{/* / /   /right// */}
    <div className="flex flex-col transition-all duration-300 flex-1">
      <HeaderHome/>
             {/* Main Content */}
             <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Cards */}
            <Suspense fallback={
              <>
              <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome back, User!
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Manage your projects, collaborate with your team, and ship code faster.
        </p>
      </div>
              <Loader className={"h-24 flex flex-1"} />
              </>
              }
            >
            <StatsCards />
            </Suspense>

            {/* Recent Projects */}
            <div>
            <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Recent Projects
        </h2>
      </div>
            <Suspense fallback={<Loader length={3} className="h-32 flex flex-1" />}>
            <RecentProjects />
            </Suspense>
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </main>
    </div>
   </MaxWidth>
  );
}
