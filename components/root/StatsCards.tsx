
import { FolderOpen, Users, GitBranch, Rocket } from "lucide-react";

const stats = [
  {
    title: "Active Projects",
    value: "12",
    icon: FolderOpen,
    color: "var(--brand-primary)"
  },
  {
    title: "Team Members", 
    value: "8",
    icon: Users,
    color: "var(--success)"
  },
  {
    title: "Code Reviews",
    value: "23", 
    icon: GitBranch,
    color: "var(--warning)"
  },
  {
    title: "Deployments",
    value: "156",
    icon: Rocket,
    color: "var(--brand-accent)"
  }
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="p-6 rounded-xl border transition-all hover:shadow-lg hover:scale-105 card-gradient"
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
      ))}
    </div>
  );
};