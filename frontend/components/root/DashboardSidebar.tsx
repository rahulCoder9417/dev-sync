'use client'

import { getProjects } from '@/lib/actions/projects/getProject'
import { Home, FolderOpen, Users, Settings, Plus, CircleX, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Project } from '../project/ProjectCard'
import { useAppSelector } from '@/lib/redux/hooks'

const sidebarItems = [
  { icon: Home, label: 'Dashboard', route: 'dashboard' },
  { icon: FolderOpen, label: 'Projects', route: 'projects' },
  { icon: Users, label: 'Team', route: 'team' },
  { icon: Settings, label: 'Settings', route: 'settings' },
]

export const DashboardSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()
  const recentProjects = useAppSelector((s)=>s.recentProjects)

  return (
    <>
      {!isSidebarOpen && (
        <button
          className="fixed top-3 left-5 w-10 z-50 p-2 bg-[var(--brand-primary)] text-white rounded-4xl cursor-pointer shadow-md hover:scale-105 transition-all duration-500 hidden md:block"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu />
        </button>
      )}

      <div
        className={`h-100vh transition-all duration-300 ease-in-out z-40 
          ${isSidebarOpen ? 'w-72' : 'w-0'} 
          overflow-hidden border-r hidden md:flex flex-col bg-[var(--bg-secondary)]`}
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Navigation
            </h2>
            <button
              className="text-white cursor-pointer"
              onClick={() => setIsSidebarOpen(false)}
            >
              <CircleX />
            </button>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={`/${item.route === 'dashboard' ? '' : item.route}`}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  hover:text-white hover:bg-[var(--brand-primary)]
                  ${
                    pathname.split('/')[1] === item.route
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'text-[var(--text-secondary)]'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 flex-1 overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Recent Projects
              </h2>
              <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                <Plus className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <div className="space-y-2">
              {recentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                <div
                  key={project.id}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/50 transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center">
                    <FolderOpen className="w-3 h-3" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                        {project.title}
                      </p>
                      <span className="text-xs px-1.5 py-0.5 rounded text-gray-300 bg-gray-600">
                        {project.type}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {project.framework}
                    </p>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
