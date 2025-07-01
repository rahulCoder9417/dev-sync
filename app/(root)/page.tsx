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
            {/* Welcome Section */}
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Welcome back, Alex!
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                Manage your projects, collaborate with your team, and ship code faster.
              </p>
            </div>

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
