// components/StatsCards.tsx
'use server'

import { getUserProjectStats } from "@/lib/actions/root/statActions";
import { FolderOpen, FolderPlus, GitBranch, Star } from "lucide-react";
import Loader from "../main/Loader";

export  async function StatsCards() {
  const stats = await getUserProjectStats();

  

  const cards = [
    {
      title: "Archeive Projects",
      value: stats?.archeive || 0,
      icon: FolderOpen,
      color: "var(--brand-primary)",
    },
    {
      title: "Total Projects",
      value: stats?.owned || 0,
      icon: FolderPlus,
      color: "var(--success)",
    },
    {
      title: "Generated Apps",
      value: stats?.generated || 0,
      icon: GitBranch,
      color: "var(--warning)",
    },
    {
      title: "Starred Repos",
      value: stats?.starred || 0,
      icon: Star,
      color: "var(--brand-accent)",
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Welcome back, {stats?.fullName.split(" ")[0] || ""}!
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Manage your projects, collaborate with your team, and ship code faster.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats ?         cards.map((stat) => (
          <div
            key={stat.title}
            className="p-6 rounded-xl cursor-pointer border transition-all hover:shadow-lg hover:scale-105 card-gradient"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {stat.title}
                </p>
                <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {stat.value}
                </p>
              </div>
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.color + '20' }}
              >
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        )):
        <Loader className="w-full h-24" />
        }

      </div>
    </>
  );
}
