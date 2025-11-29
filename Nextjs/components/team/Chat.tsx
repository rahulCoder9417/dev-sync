"use client"
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/team/sidebar';
import ChatComponent from '@/components/team/chatComponent';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateChatPopUp } from '@/lib/redux/features/chatPopUpSlice';
import { dmAndTeam } from '@/app/team/page';


const Chat = ({dmAndTeam}: {dmAndTeam: dmAndTeam}) => {
      
      const [selectedChat, setSelectedChat] = useState<{
        type:  | 'team' | 'direct';
        id: string;
        name: string;
      } | null>(null);
    
  return (
    <div className="flex max-h-screen w-screen bg-primary ">
      {/* Sidebar */}
      <Sidebar dmAndTeam={dmAndTeam} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      {/* Main Chat Area */}
      <ChatComponent selectedChat={selectedChat} dmAndTeam={dmAndTeam} />
    </div>
  )
}

export default Chat
