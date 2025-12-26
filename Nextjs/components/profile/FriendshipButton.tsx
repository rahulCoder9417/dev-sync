'use client';

import React, { useCallback, useMemo, useState } from 'react';
import {
  Ban,
  Blocks,
  Clock,
  UserCheck,
  UserCircle,
  UserPlus,
} from 'lucide-react';

import { Button } from '../ui/button';
import { useAppSelector } from '@/lib/redux/hooks';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

import { FriendshipStatus } from '@/lib/types/friendship';

type FriendAction = 'request' | 'accept' | 'reject';

interface FriendshipButtonProps {
  status: FriendshipStatus;
  userId: string;
}

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function FriendshipButton({
  status,
  userId,
}: FriendshipButtonProps) {
  const currentUserId = useAppSelector((state) => state.user.id);

  const [friendshipStatus, setFriendshipStatus] =
    useState<FriendshipStatus>(status);

  const [loading, setLoading] = useState(false);

  
  /* ---------------- API Helper ---------------- */

  const sendAction = async (action: FriendAction) => {
    setLoading(true);

    try {
      await fetch('/api/friend/toggle', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- Handlers ---------------- */

  const handlePrimaryAction = useCallback(async () => {
    switch (friendshipStatus) {
      case 'none':
        await sendAction('request');
        setFriendshipStatus('pending');
        break;

      case 'accepted':
        await sendAction('reject');
        setFriendshipStatus('none');
        break;

      case 'acceptHim':
        await sendAction('accept');
        setFriendshipStatus('accepted');
        break;
    }
  }, [friendshipStatus]);

  const handleRemoveRequest = async () => {
    await sendAction('reject');
    setFriendshipStatus('none');
  };

  /* ---------------- UI Config ---------------- */

  const buttonConfig = useMemo(() => {
    switch (friendshipStatus) {
      case 'none':
        return {
          icon: <UserPlus className="w-4 h-4" />,
          label: 'Add Friend',
          variant: 'default' as const,
        };

      case 'pending':
        return {
          icon: <Clock className="w-4 h-4" />,
          label: 'Pending',
          variant: 'outline' as const,
        };
      case 'blocked':
        return {
          icon: <Ban className="w-4 h-4" />,
          label: 'Blocked',
          variant: 'destructive' as const,
        };
      case 'accepted':
        return {
          icon: <UserCheck className="w-4 h-4" />,
          label: 'Friends',
          variant: 'default' as const,
        };

      case 'acceptHim':
        return {
          icon: <UserCheck className="w-4 h-4" />,
          label: 'Accept',
          variant: 'default' as const,
        };
    }
  }, [friendshipStatus]);
  /* ---------------- Guards ---------------- */

  if (!currentUserId || currentUserId === userId) {
    return null;
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="flex gap-2">
      <Button
        disabled={loading || friendshipStatus === 'pending' || friendshipStatus === 'blocked'}
        onClick={handlePrimaryAction}
        variant={buttonConfig.variant}
      
        className="gap-2 font-semibold cursor-pointer transition-all"
      >
        {buttonConfig.icon}
        {loading ? 'Processing...' : buttonConfig.label}
      </Button>

      {friendshipStatus === 'acceptHim' && (
        <Button
          onClick={handleRemoveRequest}
          variant="outline"
          disabled={loading}
          className="gap-2 font-semibold cursor-pointer transition-all"
        >
          <UserCircle className="w-4 h-4" />
          Remove
        </Button>
      )}
    </div>
  );
}
