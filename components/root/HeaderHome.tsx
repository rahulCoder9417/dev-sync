'use client'

import {
  Bell,
  GitBranch,
  Plus,
  Search,
  Home,
  Folder,
  Users,
  Settings,
} from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const mobileNavItems = [
  { name: 'Dashboard', icon: Home, href: '#dashboard', key: '' },
  { name: 'Projects', icon: Folder, href: '#projects', key: 'projects' },
  { name: 'Team', icon: Users, href: '#team', key: 'team' },
  { name: 'Settings', icon: Settings, href: '#settings', key: 'settings' },
]


const HeaderHome = () => {
  
const pathname=usePathname()
  const fullName = 'Alex Chen'
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('')

  return (
    <header
      className="h-16 border-b flex items-center justify-between px-4 md:px-6"
      style={{
        borderColor: 'var(--border-primary)',
        background: 'var(--bg-secondary)',
      }}
    >
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
            style={{ background: 'var(--brand-primary)' }}
          >
            DS
          </div>
          <span
            className="text-xl font-semibold hidden md:inline"
            style={{ color: 'var(--text-primary)' }}
          >
            DevSync AI
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 w-[80%] md:space-x-7">
        {/* Search bar (hidden on mobile) */}
        <div className="relative hidden md:block">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4"
            style={{ color: 'var(--text-muted)' }}
          />
          <input
            type="text"
            placeholder="Search projects, files, or team members..."
            className="pl-10 pr-4 py-2 w-80 rounded-lg border focus:outline-none focus:ring-2 transition-all"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Mobile Nav */}
        <div className="flex md:hidden items-center justify-around w-full ">
        {mobileNavItems.map(item => {
            const isActive = item.key === pathname.split("/")[1]
            const Icon = item.icon
            return (
              <Link
                key={item.key}
                href={item.key}
                className={`flex flex-col items-center justify-center px-3 py-2 rounded-md text-sm transition-all `}
              >
                <Icon size={24} className={` ${ 
                  isActive
                    ? `text-[#3d3fd2] `
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`} />
               
              </Link>
            )
          })}
        </div>

      

        {/* Desktop-only: Buttons */}
        <div className="hidden md:flex pl-10 items-center space-x-10">
          <Button
            className="text-white font-medium"
            style={{ background: 'var(--brand-primary)' }}
          >
            <GitBranch className="w-4 h-4 mr-2" />
            Import from Git
          </Button>

          <Button
            className="text-white font-medium"
            style={{ background: 'var(--brand-secondary)' }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
  {/* Bell icon */}
  <Button variant="ghost" size="icon" className="relative cursor-pointer md:left-12 ">
  <Bell className="w-5 h-5 md:w-10 md:h-6 " />

          <span
            className={`absolute -top-1 -right-1 w-3 h-3 p-2 rounded-full text-xs flex items-center justify-center text-white`}
            style={{ background: 'var(--error)' }}
          >
            3
          </span>
        </Button>
        {/* User avatar */}
        <div className="flex items-center md:absolute md:right-3 space-x-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <span
            className="font-medium hidden md:inline"
            style={{ color: 'var(--text-primary)' }}
          >
            {fullName}
          </span>
        </div>
      </div>
    </header>
  )
}

export default HeaderHome
