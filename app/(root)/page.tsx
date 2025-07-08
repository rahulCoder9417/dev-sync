import MaxWidth from "@/components/main/MaxWidth";
import HeaderHome from "@/components/root/HeaderHome";
import { QuickActions } from "@/components/root/QuickActions";
import { RecentProjects } from "@/components/root/RecentProjects";
import { StatsCards } from "@/components/root/StatsCards";

export default function Home() {
  return (
   <MaxWidth className="bg-[var(--bg-primary)] ">


{/* / /   /right// */}
    <div className="flex flex-col transition-all duration-300 flex-1">
      <HeaderHome/>
             {/* Main Content */}
             <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Cards */}
            <StatsCards />

            {/* Recent Projects */}
            <RecentProjects />

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </main>
    </div>
   </MaxWidth>
  );
}
