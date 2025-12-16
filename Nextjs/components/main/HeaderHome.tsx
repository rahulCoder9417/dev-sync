'use client'

import { Bell, GitBranch, Plus, Search, Home, Folder, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import AvatarNotify from './AvatarNotify';
import React, { memo } from 'react';

const mobileNavItems = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Projects', icon: Folder, href: '/projects' },
  { name: 'Team', icon: Users, href: '/team' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

const Logo = memo(() => (
  <div className="flex items-center space-x-2">
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white"
      style={{ background: 'var(--brand-primary)' }}
    >
      DS
    </div>
    <span className="hidden md:inline text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
      DevSync AI
    </span>
  </div>
));

const DesktopActions = memo(() => (
  <div className="hidden md:flex pl-10 items-center space-x-10">
    <Link href="/projects/create/git">
      <Button className="text-white cursor-pointer font-medium" style={{ background: 'var(--brand-primary)' }}>
        <GitBranch className="w-4 h-4 mr-2" />
        Import from Git
      </Button>
    </Link>
    <Link href="/projects/create">
    <Button className="text-white cursor-pointer font-medium" style={{ background: 'var(--brand-secondary)' }}>
      <Plus className="w-4 h-4 mr-2" />
      New Project
    </Button>
    </Link>
  </div>
));

const SearchBar = memo(() => (
  <div className="relative hidden md:block">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
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
));

const MobileNav = ({ pathname }: { pathname: string }) => {
  const navItems = React.useMemo(
    () =>
      mobileNavItems.map(item => {
        const isActive = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center px-5 py-2 rounded-md text-sm transition-all"
          >
            <Icon
              size={24}
              className={isActive ? 'text-[#3d3fd2]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}
            />
          </Link>
        );
      }),
    [pathname]
  );

  return <div className="flex md:hidden items-center justify-around w-full">{navItems}</div>;
};




const HeaderHome = () => {
  const pathname = usePathname() || '/dashboard';

  return (
    <header
      className="h-16 border-b flex items-center justify-around px-4 md:px-6"
      style={{ borderColor: 'var(--border-primary)', background: 'var(--bg-secondary)' }}
    >
      <div className="flex items-center space-x-4">
        <Logo />
      </div>

      <div className="flex items-center space-x-4 w-[80%] md:space-x-7">
        <SearchBar />
        <MobileNav pathname={pathname} />
        <DesktopActions />
        <div className="w-full flex justify-center">
          <AvatarNotify />
        </div>
      </div>
    </header>
  );
};

export default HeaderHome;
