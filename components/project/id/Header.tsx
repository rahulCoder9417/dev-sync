
import React, { useState } from 'react';
import { Users, Settings } from 'lucide-react';
import { mockUsers } from '@/app/projects/[id]/page';
import LaptopNotify from '@/components/main/LaptopNotify';

const Header = () => {
  const [showAllUsers, setShowAllUsers] = useState(false);
  const onlineUsers = mockUsers.filter(user => user.status === 'online');

  return (
    <header className="bg-secondary border-b border-primary h-16 md:flex hidden items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-primary text-lg ml-16 font-semibold">Project Name</h1>
        <div className="h-6 w-px bg-border-primary"></div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {(showAllUsers ? mockUsers : onlineUsers.slice(0, 3)).map((user) => (
              <div
                key={user.id}
                className="relative"
                title={`${user.name} (${user.status})`}
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-primary ring-2 ring-bg-primary"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-bg-primary ${
                    user.status === 'online'
                      ? 'bg-success'
                      : user.status === 'away'
                      ? 'bg-warning'
                      : 'bg-border-primary'
                  }`}
                ></div>
              </div>
            ))}
          </div>
          
          <button
            onClick={() => setShowAllUsers(!showAllUsers)}
            className="flex items-center space-x-1 px-2 py-1 text-secondary hover:text-primary hover:bg-hover rounded transition-colors"
          >
            <Users className="w-4 h-4" />
            <span className="text-sm">
              {showAllUsers ? 'Show Active' : `+${mockUsers.length - onlineUsers.slice(0, 3).length}`}
            </span>
          </button>
        </div>

        <LaptopNotify/>
      </div>
    </header>
  );
};

export default Header;