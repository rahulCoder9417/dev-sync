import { useAppSelector } from '@/lib/redux/hooks';
import React from 'react';
import Avatar from '../main/Avatar';

const ShowTypers = ({
  selectedChat,
}: {
  selectedChat: { type: 'team' | 'direct'; id: string; name: string } | null;
}) => {
  const empty: any[] = [];
  const users = useAppSelector(
    (s) => s.chat.typingUsers[selectedChat?.id!] ?? empty
  );

  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {/* Bouncing avatars */}
      <div className="flex -space-x-2">
        {users.map((i) => (
          <div
            key={i.userId}
            className="animate-bounce-avatar"
          >
            <Avatar
              fullName={i.fullName}
              avatar={i.avatar}
              className="!border-none size-4 "
            />
          </div>
        ))}
      </div>

      {/* Text label */}
      <p className="ml-3 text-sm text-secondary font-medium">
        {users.length === 1
          ? `${users[0].fullName.split(' ')[0]} is typing...`
          : 'Several people are typing...'}
      </p>
    </div>
  );
};

export default ShowTypers;
