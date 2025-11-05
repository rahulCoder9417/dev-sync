"use client"
import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/team/sidebar';
import ChatComponent from '@/components/team/chatComponent';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateChatPopUp } from '@/lib/redux/features/chatPopUpSlice';

export interface User {
  id: string;
  fullName: string;
  avatar?: string | null;
  status: 'online' | 'offline' | 'away';
}

export interface Team {
  id: string;
  name: string;
  members: User[];
}



export const currentUser: User = {
  id: 'current-user',
  fullName: 'John Doe',
  status: 'online',
};

export const users: User[] = [
  { id: '1', fullName: 'Alice Johnson', status: 'online' },
  { id: '2', fullName: 'Bob Smith', status: 'away' },
  { id: '3', fullName: 'Carol Williams', status: 'online' },
  { id: '4', fullName: 'David Brown', status: 'offline' },
  { id: '5', fullName: 'Emma Davis', status: 'online' },
  { id: '6', fullName: 'Frank Miller', status: 'away' },
  { id: '7', fullName: 'Grace Wilson', status: 'online' },
  { id: '8', fullName: 'Henry Moore', status: 'offline' },
];

export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Engineering',
    members: [users[0], users[1], users[2], currentUser],
  },
  {
    id: 'team-2',
    name: 'Design',
    members: [users[3], users[4], users[5], currentUser],
  },
  {
    id: 'team-3',
    name: 'Marketing',
    members: [users[6], users[7], currentUser],
  },
];


const Chat = () => {
  
  const [selectedChat, setSelectedChat] = useState<{
    type: 'global' | 'team' | 'direct';
    id?: string;
    name: string;
  }>({ type: 'global', name: 'Global Chat' });


const dispatch = useAppDispatch();

  

  return (
    <div className="flex max-h-screen w-screen bg-primary ">
      {/* Sidebar */}
      <Sidebar teams={teams} selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
      {/* Main Chat Area */}
      <ChatComponent selectedChat={selectedChat} />
    </div>
  );
};

export default Chat;