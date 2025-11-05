import React, { useState, useMemo } from 'react'
import Avatar from '../main/Avatar'
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Home, Search, Users, X, Send } from 'lucide-react'
import { Team, User, users as allUsers } from '@/app/team/page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch } from '@/lib/redux/hooks';
import { updateChatPopUp } from '@/lib/redux/features/chatPopUpSlice';

interface SidebarProps {
  teams: Team[];
  selectedChat: {
    type: 'global' | 'team' | 'direct';
    id?: string;
    name: string;
  };
  setSelectedChat: (chat: {
    type: 'global' | 'team' | 'direct';
    id?: string;
    name: string;
  }) => void;
}

const Sidebar = ({ teams, selectedChat, setSelectedChat }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useAppDispatch();
  // Filter teams and users based on search term
  const filteredTeams = useMemo(() => {
    if (!searchTerm) return teams;
    const term = searchTerm.toLowerCase();
    return teams.filter(team =>
      team.name.toLowerCase().includes(term) ||
      team.members.some(member =>
        member.fullName.toLowerCase().includes(term)
      )
    );
  }, [teams, searchTerm]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return allUsers;
    const term = searchTerm.toLowerCase();
    return allUsers.filter(user =>
      user.fullName.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-80 bg-card border-r border-primary overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-primary">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-hover"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Input
            placeholder="Search users and teams..."
            className="flex-1 mx-3 text-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

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
            <TabsTrigger value="all" className="flex-1 cursor-pointer">All</TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 cursor-pointer">Unread</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">

        {/* Teams */}

        {filteredTeams.length > 0 && (
          <div className="p-2 mt-2">
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs font-semibold text-secondary uppercase">
                Teams
              </span>
              {searchTerm && (
                <span className="text-xs text-muted-foreground">
                  {filteredTeams.length} found
                </span>
              )}
            </div>
            {filteredTeams.map((team) => (
              <div
              key={team.id}
              className='w-auto h-auto relative'>
              <button
                onClick={() => {
                  setSelectedChat({ type: 'team', id: team.id, name: team.name });
                  if (searchTerm) clearSearch();
                }}
                className={`w-full flex cursor-pointer items-center gap-3 px-3 py-2 rounded-lg hover:bg-hover transition-colors ${selectedChat.type === 'team' && selectedChat.id === team.id ? 'bg-hover' : ''
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
              
              
              <Button variant="ghost" size="icon" className="hover:bg-hover absolute right-2 top-2 cursor-pointer " onClick={()=>{
                dispatch(updateChatPopUp({
                  isOpen: true,
                  selectedChat: { type: 'team', id: team.id, name: team.name }
                }))
              }}>
                    <Send className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Direct Messages */}
        {filteredUsers.length > 0 && (
          <div className="p-2 mt-4">
            <div className="flex justify-between items-center px-3 py-2">
              <span className="text-xs font-semibold text-secondary uppercase">
                Direct Messages
              </span>
              {searchTerm && (
                <span className="text-xs text-muted-foreground">
                  {filteredUsers.length} found
                </span>
              )}
            </div>
            {filteredUsers.map((user) => (
              <div className='w-auto h-auto relative'>
              <button
                key={user.id}
                onClick={() => setSelectedChat({ type: 'direct', id: user.id, name: user.fullName })}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-hover transition-colors ${selectedChat.type === 'direct' && selectedChat.id === user.id ? 'bg-hover' : ''
                  }`}
              >
                <div className="relative">
                  <Avatar fullName={user.fullName} avatar={user.avatar} className='!w-10 !h-10' />
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
              <Button variant="ghost" size="icon" className="hover:bg-hover absolute right-2 top-2 cursor-pointer " onClick={()=>{
                dispatch(updateChatPopUp({
                  isOpen: true,
                  selectedChat: { type: 'direct', id: user.id, name: user.fullName }
                }))
              }}>
                    <Send className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {filteredUsers.length === 0 && (
          <div className="p-2 mt-4 mx-auto flex items-center justify-center flex-col py-2 text-primary ">
            Type Whole fullName to find a user
            <Button variant="default" size="icon" className="hover:bg-hover text-pretty mt-3 w-auto px-2">
              Hit me to Find Friend
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>

  )
}


export default Sidebar
