import { Hash, Send, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Avatar from '../main/Avatar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { users, teams, currentUser,User } from '../../app/team/page'
export interface Message {
  id: string;
  sender: User;
  content: string;
  timestamp: Date;
  chatType: 'global' | 'team' | 'direct';
  teamId?: string;
  recipientId?: string;
}
const ChatComponent = ({ selectedChat }: { selectedChat: { type: 'global' | 'team' | 'direct'; id?: string; name: string } }) => {
  const currUser: User = { id: '1', fullName: 'Alice Johnson', status: 'online' }
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
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
  ]);
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
      const newMessage: Message = {
        id: `msg-${messages.length + 1}`,
        sender: currUser,
        content: messageText,
        timestamp: new Date(),
        chatType: selectedChat.type,
        teamId: selectedChat.type === 'team' ? selectedChat.id : undefined,
        recipientId: selectedChat.type === 'direct' ? selectedChat.id : undefined,
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageText('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  return (
    <div className="flex-1 flex flex-col h-screen">
      {/* Chat Header */}
      <div className="h-16 bg-card border-b border-primary px-6 flex items-center gap-4 flex-shrink-0">
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
      <div className="flex-1 h-auto bg-primary overflow-y-auto p-6">
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
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6 bg-card border-t border-primary flex-shrink-0">
        <div className="max-w-4xl flex gap-3">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Message ${selectedChat.name}...`}
            className="flex-1  bg-secondary text-primary border-primary"
          />
          <Button onClick={handleSend} size="icon" className="bg-brand hover:opacity-90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChatComponent
