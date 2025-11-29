
import React, { useMemo, useState } from 'react';
import { Users, Settings } from 'lucide-react';
import LaptopNotify from '@/components/main/AvatarNotify';
import Avatar from '@/components/main/Avatar';
import { UserSummary } from '@/types';
type HeaderProps = {
  projectName: string; 
  users:{
     user: { 
      id: string; fullName: string; username: string; avatar: string | null; };
      userId: string;
       role: "ADMIN"|"MEMBER"; }[];
  participantsRef: string[];
      }

const Header = ({ projectName ,users,participantsRef}: HeaderProps) => {

  const [showAllUsers, setShowAllUsers] = useState(false);
 const onlineUsers = useMemo(()=>{
  console.log("user online")
  return users.filter((user)=>participantsRef.includes(user.userId))
 },[participantsRef.length])

  return (
    <header className="bg-secondary border-b border-primary h-16 md:flex hidden items-center  justify-between px-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-primary text-lg ml-16 font-semibold">{projectName}</h1>
        <div className="h-6 w-px bg-border-primary"></div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {(showAllUsers ? onlineUsers : users)?.map((user :any) => (

              <Avatar getInfo={true} className=' w-8! h-8!' key={user.user.id} fullName={user.user.fullName} username={user.user.username} avatar={user.user.avatar} />
            ))}
          </div>
          
          <button
            onClick={() => setShowAllUsers(!showAllUsers)}
            className="flex items-center space-x-1 px-2 py-1 text-secondary font-bold cursor-pointer hover:text-[#d5c4c4] hover:bg-hover rounded "
          >
            <Users className="w-4 h-4 " />
            <span className="text-sm cursor-pointer">
              {!showAllUsers ? 'Show Active' : `+${users?.length - onlineUsers?.length}`}
            </span>
          </button>
        </div>

        <LaptopNotify/>
      </div>
    </header>
  );
};

export default Header;