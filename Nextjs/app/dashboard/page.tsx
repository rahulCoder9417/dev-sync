export const dynamic = 'force-dynamic';

import { Suspense } from 'react';

import MaxWidth from '@/components/main/MaxWidth';
import HeaderHome from '@/components/main/HeaderHome';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { StatsCards } from '@/components/dashboard/StatsCards';
import Loader from '@/components/main/Loader';

/* -------------------------------------------------------------------------- */
/*                               Fallback UI                                  */
/* -------------------------------------------------------------------------- */

function StatsFallback() {
  return (
    <>
      <div>
        <h1
          className="text-4xl font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Welcome back, User!
        </h1>
        <p
          className="text-lg"
          style={{ color: 'var(--text-secondary)' }}
        >
          Manage your projects, collaborate with your team, and ship code faster.
        </p>
      </div>

      <Loader className="h-24 flex flex-1" />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Page                                     */
/* -------------------------------------------------------------------------- */

export default function Dashboard() {
  return (
    <MaxWidth className="bg-[var(--bg-primary)]">
      <div className="flex flex-col flex-1 transition-all duration-300">
        <HeaderHome />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats */}
            <Suspense fallback={<StatsFallback />}>
              <StatsCards />
            </Suspense>

            {/* Recent Projects */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Recent Projects
                </h2>
              </div>

              <Suspense
                fallback={<Loader length={3} className="h-32 flex flex-1" />}
              >
                <RecentProjects />
              </Suspense>
            </section>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </main>
      </div>
    </MaxWidth>
  );
}
