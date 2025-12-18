'use client';

import { useEffect, useMemo, useState } from 'react';
import { Upload, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FriendshipStatus from '@/components/settings/FriendshipStatus';
import Profile from '@/components/settings/Profile';
import FriendsList, {
  Friend,
} from '@/components/settings/FriendsList';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type SettingsTab = 'profile' | 'friends';

/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

export default function Page() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- Derived State ---------------- */

  const { acceptedCount, pendingCount } = useMemo(() => {
    let accepted = 0;
    let pending = 0;

    for (const friend of friends) {
      if (friend.status === 'accepted') accepted++;
      if (friend.status === 'pending') pending++;
    }

    return { acceptedCount: accepted, pendingCount: pending };
  }, [friends]);

  /* ---------------- Effects ---------------- */

  useEffect(() => {
    const controller = new AbortController();

    async function fetchFriends() {
      try {
        const res = await fetch('/api/friend/userFriends', {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error('Failed to fetch friends');
        }

        const data = await res.json();
        setFriends(data.userFriends);
      } catch (error) {
        if ((error as any).name !== 'AbortError') {
          console.error('Error fetching friends:', error);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchFriends();

    return () => controller.abort();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex-1 bg-primary">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Tabs */}
        <Tabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Stats */}
        <FriendshipStatus
          acceptedCount={acceptedCount}
          pendingCount={pendingCount}
        />

        {/* Content */}
        {activeTab === 'profile' && <Profile />}

        {activeTab === 'friends' && (
          <FriendsList
            friends={friends}
            acceptedCount={acceptedCount}
            pendingCount={pendingCount}
            loading={loading}
            setFriends={setFriends}
          />
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Subcomponents                                  */
/* -------------------------------------------------------------------------- */

function Tabs({
  activeTab,
  onChange,
}: {
  activeTab: SettingsTab;
  onChange: (tab: SettingsTab) => void;
}) {
  return (
    <div className="mb-8 flex gap-2 p-1 rounded-xl border items-center justify-center h-14 bg-[#413e4b] w-fit border-primary">
      <TabButton
        active={activeTab === 'profile'}
        onClick={() => onChange('profile')}
        icon={<Upload className="w-6 h-6" />}
      >
        Profile Settings
      </TabButton>

      <TabButton
        active={activeTab === 'friends'}
        onClick={() => onChange('friends')}
        icon={<Users className="w-6 h-6" />}
      >
        Friends
      </TabButton>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button
      variant={active ? 'default' : 'ghost'}
      onClick={onClick}
      className={`gap-2 h-12 text-lg ${
        active ? 'bg-[#4759f5]' : ''
      }`}
    >
      {icon}
      {children}
    </Button>
  );
}
