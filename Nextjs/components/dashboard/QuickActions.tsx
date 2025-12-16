import { Plus, GitBranch, Users, FolderCheck } from "lucide-react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface QuickAction {
  title: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    title: "Create Project",
    icon: Plus,
    href: "/projects/create",
    color: "var(--brand-primary)",
  },
  {
    title: "Import Repository",
    icon: GitBranch,
    href: "/projects/create/git",
    color: "var(--success)",
  },
  {
    title: "Join Team",
    icon: Users,
    href: "/team",
    color: "var(--warning)",
  },
  {
    title: "See Projects",
    icon: FolderCheck,
    href: "/projects",
    color: "var(--brand-accent)",
  },
];

export function QuickActions() {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {QUICK_ACTIONS.map(({ title, icon: Icon, href, color }) => (
          <Link key={title} href={href} prefetch>
            <div
              className="p-8 rounded-xl border transition-all hover:shadow-lg hover:scale-[1.03] cursor-pointer card-gradient text-center"
              style={{ borderColor: "var(--border-primary)" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${color}20` }}
              >
                <Icon className="w-8 h-8" style={{ color }} />
              </div>

              <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                {title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
