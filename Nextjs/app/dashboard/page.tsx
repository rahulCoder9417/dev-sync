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

function StatsError() {
  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded">
      <p>Failed to load statistics. Please refresh the page.</p>
    </div>
  );
}

function ProjectsError() {
  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded">
      <p>Failed to load projects. Please refresh the page.</p>
    </div>
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
              <StatsCardsWrapper />
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
                <RecentProjectsWrapper />
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

// Wrapper components with error handling
async function StatsCardsWrapper() {
  try {
    return <StatsCards />;
  } catch (error) {
    console.error('StatsCards error:', error);
    return <StatsError />;
  }
}

async function RecentProjectsWrapper() {
  try {
    return <RecentProjects />;
  } catch (error) {
    console.error('RecentProjects error:', error);
    return <ProjectsError />;
  }
}