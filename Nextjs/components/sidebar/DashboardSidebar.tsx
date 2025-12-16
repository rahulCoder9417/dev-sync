"use client";

import React, { memo, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, CircleX, FolderOpen, Plus } from "lucide-react";

import { SIDEBAR_ITEMS } from "@/components/sidebar/sidebar.constants";
import { useAppSelector } from "@/lib/redux/hooks";
import { RecentProject } from "@/lib/types/projects";

const DashboardSidebarComponent = () => {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const recentProjects = useAppSelector(
    (state) => state.recentProjects
  ) as RecentProject[];

  const activeRoute = pathname.split("/")[1] ?? "";

  const toggleSidebar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const navigationItems = useMemo(
    () =>
      SIDEBAR_ITEMS.map(({ icon: Icon, label, route }) => {
        const isActive = activeRoute === route;

        return (
          <Link
            key={label}
            href={`/${route}`}
            className={`
              flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
              ${isActive
                ? "bg-[var(--brand-primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--brand-primary)] hover:text-white"}
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{label}</span>
          </Link>
        );
      }),
    [activeRoute]
  );

  const recentProjectItems = useMemo(
    () =>
      recentProjects.map((project) => (
        <Link key={project.id} href={`/projects/${project.id}`}>
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors">
            <div className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center">
              <FolderOpen className="w-3 h-3 text-[var(--text-secondary)]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate text-[var(--text-primary)]">
                  {project.title}
                </p>
                <span className="text-xs px-1.5 py-0.5 rounded bg-gray-600 text-gray-300">
                  {project.type}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {project.framework}
              </p>
            </div>
          </div>
        </Link>
      )),
    [recentProjects]
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-5 z-50 hidden md:block p-2 rounded-full bg-[var(--brand-primary)] text-white shadow-md hover:scale-105 transition"
        >
          <Menu />
        </button>
      )}

      <aside
        className={`hidden md:flex flex-col bg-[var(--bg-secondary)] border-r border-primary transition-all duration-300 ${
          isOpen ? "min-w-72" : "w-0 overflow-hidden"
        }`}
      >
        <div className="p-4 flex flex-col flex-1">
          <header className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-[var(--text-secondary)]">
              Navigation
            </h2>
            <button onClick={toggleSidebar}>
              <CircleX className="text-white" />
            </button>
          </header>

          <nav className="space-y-2">{navigationItems}</nav>

          <section className="mt-8 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-[var(--text-secondary)]">
                Recent Projects
              </h2>
              <Link href="/projects/create">
              <button  className="p-1 rounded hover:bg-gray-700">
                <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              </Link>
            </div>

            <div className="space-y-2">{recentProjectItems}</div>
          </section>
        </div>
      </aside>
    </>
  );
};

export const DashboardSidebar = memo(DashboardSidebarComponent);
