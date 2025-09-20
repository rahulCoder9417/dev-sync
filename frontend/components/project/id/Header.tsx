
import React, { useState } from 'react';
import { Users, Settings } from 'lucide-react';
import LaptopNotify from '@/components/main/AvatarNotify';
import Avatar from '@/components/main/Avatar';

type HeaderProps = {
  projectName: string; 
  mockusers:{
     user: { 
      id: string; fullName: string; username: string; avatar: string | null; };
      userId: string;
       role: "ADMIN"|"MEMBER"; }[]}

const Header = ({ projectName ,mockusers}: HeaderProps) => {
  const [showAllUsers, setShowAllUsers] = useState(false);
 const onlineUsers = mockusers?.slice(0,1);

  return (
    <header className="bg-secondary border-b border-primary h-16 md:flex hidden items-center  justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-primary text-lg ml-16 font-semibold">{projectName}</h1>
        <div className="h-6 w-px bg-border-primary"></div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {(showAllUsers ? mockusers : onlineUsers?.slice(0, 3))?.map((user :any) => (

              <Avatar className=' w-8! h-8!' key={user.user.id} fullName={user.user.fullName} avatar={user.user.avatar} />
            ))}
          </div>
          
          <button
            onClick={() => setShowAllUsers(!showAllUsers)}
            className="flex items-center space-x-1 px-2 py-1 text-secondary font-bold cursor-pointer hover:text-[#d5c4c4] hover:bg-hover rounded "
          >
            <Users className="w-4 h-4 " />
            <span className="text-sm cursor-pointer">
              {showAllUsers ? 'Show Active' : `+${mockusers?.length - onlineUsers?.slice(0, 3)?.length}`}
            </span>
          </button>
        </div>

        <LaptopNotify/>
      </div>
    </header>
  );
};

export default Header;