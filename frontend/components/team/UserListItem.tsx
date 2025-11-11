import React, { memo, useEffect } from 'react';
import Avatar from '../main/Avatar';
import { Button } from '../ui/button';
import { Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateChatPopUp } from '@/lib/redux/features/chatPopUpSlice';
import { shallowEqual } from 'react-redux';
import { useState } from 'react';
interface UserListItemProps {
  user: {
    id: string;
    userId: string;
    fullName: string;
    username: string;
    avatar?: string | null;
    lastMessage: boolean | null;
    lastMessageAt: Date;
  };
  selectedChat: {
    type: 'team' | 'direct';
    id: string;
    name: string;
  } | null;
  setSelectedChat: (chat: {
    type: 'team' | 'direct';
    id: string;
    name: string;
  }) => void;
  clearSearch?: () => void;
}

const UserListItem = memo(({ user, selectedChat, setSelectedChat, clearSearch }: UserListItemProps) => {
  const dispatch = useAppDispatch();
  const [lastMessage, setlastMessage] = useState<boolean | null>(user.lastMessage)
  let newRead = useAppSelector(
    (state) =>
      state.chat.messagesCache.direct[user.id],
    shallowEqual
  );
  useEffect(() => {
    if(!newRead) return
    if (newRead && newRead.messages[newRead.messages.length - 1]?.isRead === false && newRead.messages[newRead.messages.length - 1]?.sender.id === user.userId) {
      setlastMessage(false)
    }
  
    
  }, [newRead])
  
  // Only select the online status for THIS specific user

  const isOnline = useAppSelector(
    (state) =>
      state.onlineUser.onlineUsers.includes(
        user.userId
      ),
    shallowEqual
  );

  return (
    <div key={user.id} className='w-auto h-auto relative cursor-pointer hover:bg-hover'>
      <button
        onClick={() => {
          setSelectedChat({ type: 'direct', id: user.id, name: user.fullName });
          setlastMessage(true)
          if (clearSearch) clearSearch();
        }}
        className={`w-full flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg hover:bg-primary transition-colors ${selectedChat?.type === 'direct' && selectedChat.id === user.id ? 'bg-hover' : ''
          }`}
      >
        <Avatar
          fullName={user.fullName}
          avatar={user.avatar || ''}
          username={user.username}
          getInfo={true}
          className='!w-10 !h-10'
          getStatus={true}
          status={isOnline ? 'online' : 'offline'}
        />

        <div className="flex-1 text-left">
          <p className="font-medium text-primary">{user.fullName}</p>
          <p className="text-xs text-secondary capitalize">@{user.username}</p>
        </div>
      </button>
        {lastMessage === false && (
          <div className='size-3 absolute right-16 top-5 rounded-full bg-blue-800' />
        )}
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-hover absolute right-2 top-2 cursor-pointer"
          onClick={() => {
            dispatch(updateChatPopUp({
              isOpen: true,
              selectedChat: { type: 'direct', id: user.id, name: user.fullName }
            }))
            setlastMessage(true)
          }}
        >
          <Send className="h-5 w-5" />
        </Button>
      
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if the user data, selectedChat, or callbacks change
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.user.userId === nextProps.user.userId &&
    prevProps.user.fullName === nextProps.user.fullName &&
    prevProps.user.avatar === nextProps.user.avatar &&
    prevProps.user.lastMessage === nextProps.user.lastMessage &&
    prevProps.selectedChat?.id === nextProps.selectedChat?.id &&
    prevProps.selectedChat?.type === nextProps.selectedChat?.type
  );
});

UserListItem.displayName = 'UserListItem';

export default UserListItem;
