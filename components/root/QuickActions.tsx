
import { Plus, GitBranch, Users, Star } from "lucide-react";

const actions = [
  {
    title: "Create Project",
    icon: Plus,
    color: "var(--brand-primary)"
  },
  {
    title: "Import Repository", 
    icon: GitBranch,
    color: "var(--success)"
  },
  {
    title: "Join Team",
    icon: Users,
    color: "var(--warning)"
  },
  {
    title: "Browse Templates",
    icon: Star,
    color: "var(--brand-accent)"
  }
];

export const QuickActions = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((action) => (
          <div
            key={action.title}
            className="p-8 rounded-xl border transition-all hover:shadow-lg hover:scale-105 cursor-pointer card-gradient text-center"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: action.color + '20' }}
            >
              <action.icon className="w-8 h-8" style={{ color: action.color }} />
            </div>
            <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {action.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};