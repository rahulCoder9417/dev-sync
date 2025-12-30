'use client';

import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { Clock, UserCheck } from 'lucide-react';

import Avatar from '../main/Avatar';
import { Button } from '../ui/button';
import { handleFriendAction } from '@/lib/actions/friends/friendActions';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type FriendStatus = 'accepted' | 'pending';
export type FriendFilter = 'all' | 'accepted' | 'pending';

export interface Friend {
  id: string;
  fullName: string;
  username: string;
  avatar: string | null;
  status: FriendStatus;
  isInitiator: boolean;
}

interface FriendsListProps {
  friends: Friend[];
  acceptedCount: number;
  pendingCount: number;
  loading: boolean;
  setFriends: React.Dispatch<React.SetStateAction<Friend[]>>;
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function FriendsList({
  friends,
  acceptedCount,
  pendingCount,
  loading,
  setFriends,
}: FriendsListProps) {
  const [filter, setFilter] = useState<FriendFilter>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  /* ---------------- Derived State ---------------- */

  const filteredFriends = useMemo(() => {
    if (filter === 'all') return friends;
    return friends.filter((friend) => friend.status === filter);
  }, [friends, filter]);

  /* ---------------- Handlers ---------------- */

  const handleAction = useCallback(
    async (friend: Friend) => {
      setActionLoadingId(friend.id);

      try {
        const action =
          friend.status === 'pending' ? 'accept' : 'unfriend';

        await handleFriendAction(friend.id, action);

        setFriends((prev) => {
          if (friend.status === 'pending') {
            return prev.map((f) =>
              f.id === friend.id
                ? { ...f, status: 'accepted' }
                : f
            );
          }

          return prev.filter((f) => f.id !== friend.id);
        });
      } finally {
        setActionLoadingId(null);
      }
    },
    [setFriends]
  );

  /* ---------------- UI ---------------- */

  return (
    <div
      className="p-6 rounded-xl border bg-[#413e4b]"
      style={{ borderColor: 'hsl(var(--border-primary))' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary">
          Friends List
        </h2>

        {/* Filters */}
        <div className="flex gap-2">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
          >
            All ({friends.length})
          </FilterButton>

          <FilterButton
            active={filter === 'accepted'}
            onClick={() => setFilter('accepted')}
            icon={<UserCheck className="w-3 h-3" />}
          >
            Accepted ({acceptedCount})
          </FilterButton>

          <FilterButton
            active={filter === 'pending'}
            onClick={() => setFilter('pending')}
            icon={<Clock className="w-3 h-3" />}
          >
            Pending ({pendingCount})
          </FilterButton>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-muted animate-pulse">
          Loading friends...
        </div>
      ) : filteredFriends.length === 0 ? (
        <div className="text-center py-12 text-muted">
          No friends found in this category
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFriends.map((friend) => (
            <FriendRow
              key={friend.id}
              friend={friend}
              loading={actionLoadingId === friend.id}
              onAction={() => handleAction(friend)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Subcomponents                                */
/* -------------------------------------------------------------------------- */

function FriendRow({
  friend,
  loading,
  onAction,
}: {
  friend: Friend;
  loading: boolean;
  onAction: () => void;
}) {
  const isPending = friend.status === 'pending';

  return (
    <div className="flex items-center justify-between p-4 rounded-lg bg-secondary border-secondary border hover:bg-opacity-50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar
          fullName={friend.fullName}
          username={friend.username}
          avatar={friend.avatar}
          className="w-12 h-12"
        />

        <div>
          <h3 className="font-medium text-primary">
            {friend.fullName}
          </h3>
          <p className="text-sm text-muted">@{friend.username}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <StatusBadge status={friend.status} />

        <Link href={`/profile/${friend.username}`}>
          <Button size="sm" variant="outline">
            View Profile
          </Button>
        </Link>

        <Button
          size="sm"
          variant="outline"
          disabled={loading || (friend.status === 'pending' && friend.isInitiator)}
          onClick={onAction}
        >
          {loading
            ? 'Processing...'
            
            : isPending
            ? friend.isInitiator 
            ? 'pending'
            : 'Accept'
            : 'Unfriend'}
        </Button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: FriendStatus }) {
  if (status === 'accepted') {
    return (
      <span className="flex items-center gap-1 text-sm px-3 py-1 text-green-400 bg-green-400/30 rounded-full">
        <UserCheck className="w-3 h-3" />
        Accepted
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 text-sm px-3 py-1 text-yellow-400 bg-yellow-400/30 rounded-full">
      <Clock className="w-3 h-3" />
      Pending
    </span>
  );
}

function FilterButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      size="sm"
      onClick={onClick}
      className={`gap-1 ${
        active ? 'bg-[#4759f5]' : 'bg-primary'
      }`}
    >
      {icon}
      {children}
    </Button>
  );
}
