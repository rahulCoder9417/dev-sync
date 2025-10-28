"use client"
import React, { useState } from 'react';
import { Send, Hash, Users, MessageCircle, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Avatar from '@/components/main/Avatar';


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
  
  export interface Message {
    id: string;
    sender: User;
    content: string;
    timestamp: Date;
    chatType: 'global' | 'team' | 'direct';
    teamId?: string;
    recipientId?: string;
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
  
  export const messages: Message[] = [
    {
      id: 'msg-1',
      sender: users[0],
      content: 'Hey everyone! Welcome to the global chat',
      timestamp: new Date('2025-10-26T12:00:00Z'),
      chatType: 'global',
    },
    {
      id: 'msg-2',
      sender: users[1],
      content: 'Great to be here!',
      timestamp: new Date('2025-10-26T12:05:00Z'),
      chatType: 'global',
    },
    {
      id: 'msg-3',
      sender: users[0],
      content: 'Can we discuss the new feature requirements?',
      timestamp: new Date('2025-10-26T12:10:00Z'),
      chatType: 'team',
      teamId: 'team-1',
    },
    {
      id: 'msg-4',
      sender: users[2],
      content: 'Sure, I have some ideas to share',
      timestamp: new Date('2025-10-26T12:15:00Z'),
      chatType: 'team',
      teamId: 'team-1',
    },
    {
      id: 'msg-5',
      sender: users[3],
      content: 'Hey, did you see the latest designs?',
      timestamp: new Date('2025-10-26T12:30:00Z'),
      chatType: 'direct',
      recipientId: currentUser.id,
    },
    {
      id: 'msg-6',
      sender: currentUser,
      content: 'Yes! They look amazing',
      timestamp: new Date('2025-10-26T12:35:00Z'),
      chatType: 'direct',
      recipientId: '4',
    },
    {
      id: 'msg-7',
      sender: users[6],
      content: 'Marketing campaign is ready to launch',
      timestamp: new Date('2025-10-26T12:45:00Z'),
      chatType: 'team',
      teamId: 'team-3',
    },
  ];
  
  
  export interface Notification {
    id: string;
    message: string;
    sender: User;
    timestamp: Date;
    read: boolean;
    chatType: 'global' | 'team' | 'direct';
    teamId?: string;
    userId?: string;
  }
  
  export const notifications: Notification[] = [
    {
      id: 'notif-1',
      message: 'New message in Engineering team',
      sender: users[0],
      timestamp: new Date('2025-10-26T12:35:00Z'),
      read: false,
      chatType: 'team',
      teamId: 'team-1',
    },
    {
      id: 'notif-2',
      message: 'David Brown sent you a message',
      sender: users[3],
      timestamp: new Date('2025-10-26T12:35:00Z'),
      read: false,
      chatType: 'direct',
      userId: '4',
    },
    {
      id: 'notif-3',
      message: 'New message in Global Chat',
      sender: users[1],
      timestamp: new Date('2025-10-26T12:45:00Z'),
      read: true,
      chatType: 'global',
    },
  ];
  

const Chat = () => {
  const [selectedChat, setSelectedChat] = useState<{
    type: 'global' | 'team' | 'direct';
    id?: string;
    name: string;
  }>({ type: 'global', name: 'Global Chat' });
  const [messageText, setMessageText] = useState('');

  const getFilteredMessages = () => {
    if (selectedChat.type === 'global') {
      return messages.filter((m) => m.chatType === 'global');
    } else if (selectedChat.type === 'team') {
      return messages.filter((m) => m.chatType === 'team' && m.teamId === selectedChat.id);
    } else {
      return messages.filter(
        (m) =>
          m.chatType === 'direct' &&
          (m.sender.id === selectedChat.id || m.recipientId === selectedChat.id)
      );
    }
  };

  const handleSend = () => {
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <div className="flex h-screen w-screen bg-primary max-h-screen">
      {/* Sidebar */}
      <div className="w-80 bg-card border-r border-primary overflow-y-auto flex flex-col">
        <div className="p-4 border-b border-primary">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-primary">Messages</h1>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-hover"
            >
              <Home className="h-5 w-5" />
            </Button>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full bg-secondary">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <ScrollArea className="flex-1">
          {/* Global Chat */}
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-secondary uppercase">
              General
            </div>
            <button
              onClick={() => setSelectedChat({ type: 'global', name: 'Global Chat' })}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hover transition-colors ${
                selectedChat.type === 'global' ? 'bg-hover' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
                <Hash className="h-5 w-5 text-brand" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-primary">Global Chat</p>
                <p className="text-xs text-secondary">Everyone</p>
              </div>
            </button>
          </div>

          {/* Teams */}
          <div className="p-2 mt-4">
            <div className="px-3 py-2 text-xs font-semibold text-secondary uppercase">
              Teams
            </div>
            {teams.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedChat({ type: 'team', id: team.id, name: team.name })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hover transition-colors ${
                  selectedChat.type === 'team' && selectedChat.id === team.id ? 'bg-hover' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
                  <Users className="h-5 w-5 m-auto mt-2.5" style={{ color: '#8b5cf6' }} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-primary">{team.name}</p>
                  <p className="text-xs text-secondary">{team.members.length} members</p>
                </div>
              </button>
            ))}
          </div>

          {/* Direct Messages */}
          <div className="p-2 mt-4">
            <div className="px-3 py-2 text-xs font-semibold text-secondary uppercase">
              Direct Messages
            </div>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedChat({ type: 'direct', id: user.id, name: user.fullName })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hover transition-colors ${
                  selectedChat.type === 'direct' && selectedChat.id === user.id ? 'bg-hover' : ''
                }`}
              >
                <div className="relative">
                  <Avatar fullName={user.fullName} avatar={user.avatar} className='!w-10 !h-10'  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2`}
                    style={{ 
                      borderColor: 'var(--bg-card)',
                      backgroundColor: user.status === 'online' ? 'var(--success)' : user.status === 'away' ? 'var(--warning)' : 'var(--text-muted)'
                    }}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-primary">{user.fullName}</p>
                  <p className="text-xs text-secondary capitalize">{user.status}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-card border-b border-primary px-6 flex items-center gap-4">
          {selectedChat.type === 'global' && (
            <div className="w-10 h-10 rounded-lg bg-brand/20 flex items-center justify-center">
              <Hash className="h-5 w-5 text-brand" />
            </div>
          )}
          {selectedChat.type === 'team' && (
            <div className="w-10 h-10 rounded-lg" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
              <Users className="h-5 w-5 m-auto mt-2.5" style={{ color: '#8b5cf6' }} />
            </div>
          )}
          {selectedChat.type === 'direct' && (
            <Avatar
            className='!w-10 !h-10'
              fullName={selectedChat.name}
              avatar={users.find((u) => u.id === selectedChat.id)?.avatar}
            />
          )}
          <div>
            <h2 className="font-semibold text-primary">{selectedChat.name}</h2>
            {selectedChat.type === 'team' && (
              <p className="text-xs text-secondary">
                {teams.find((t) => t.id === selectedChat.id)?.members.length} members
              </p>
            )}
            {selectedChat.type === 'direct' && (
              <p className="text-xs text-secondary capitalize">
                {users.find((u) => u.id === selectedChat.id)?.status}
              </p>
            )}
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6 max-w-4xl">
            {getFilteredMessages().map((msg) => (
              <div key={msg.id} className="flex gap-4">
                <Avatar className='!w-10 !h-10' fullName={msg.sender.fullName} avatar={msg.sender.avatar} />
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="font-semibold text-primary">{msg.sender.fullName}</span>
                    <span className="text-xs text-secondary">
                      {msg.timestamp.toISOString().split('T')[1].split('.')[0]}
                    </span>
                  </div>
                  <p className="text-primary mt-1">{msg.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-6 bg-card border-t border-primary">
          <div className="max-w-4xl flex gap-3">
            <Input
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${selectedChat.name}...`}
              className="flex-1 bg-secondary border-primary"
            />
            <Button onClick={handleSend} size="icon" className="bg-brand hover:opacity-90">
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;