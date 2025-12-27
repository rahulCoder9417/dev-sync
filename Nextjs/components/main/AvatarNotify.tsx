'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { shallowEqual } from 'react-redux';
import { useRouter } from "next/navigation";

import { Button } from '../ui/button';
import Avatar from './Avatar';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { removeNotification } from '@/lib/redux/features/userSlice';
import Link from 'next/link';
import { Notification } from '@/lib/types/notification';
import { updateChatPopUp } from '@/lib/redux/features/chatPopUpSlice';


/* -------------------------------------------------------------------------- */
/*                                Component                                   */
/* -------------------------------------------------------------------------- */

function AvatarNotify() {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter()
  const { fullName, avatar, notifications, username } = useAppSelector(
    (state) => state.user,
    shallowEqual
  );
  const [isOpen, setIsOpen] = useState(false);

  /* ---------------------------- Event Handlers ------------------------------- */

  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  const deleteNotification = async (id: string) => {
    // optimistic UI
    dispatch(removeNotification(id));

    try {
      await fetch('/api/notification/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error('Failed to delete notification', error);
    }
  };

  /* ---------------------------- Cleanup / Effects ----------------------------- */

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  /* ---------------------------------- UI ------------------------------------ */

  return (
    <div
      ref={containerRef}
      className="relative flex items-center gap-5 md:gap-10 md:mr-5"
    >
      {/* Notification Bell */}
      <Button
        onClick={toggleNotifications}
        variant="ghost"
        size="icon"
        className="relative mt-2"
      >
        <Bell className="w-5 h-5 md:w-6 md:h-6" />

        {notifications.length > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full text-[10px] flex items-center justify-center text-white"
            style={{ background: 'var(--error)' }}
          >
            {notifications.length}
          </span>
        )}
      </Button>

      {/* Notifications Panel */}
      {isOpen && (
        <div className="absolute top-12 right-6 w-72 max-h-96 bg-secondary border border-primary rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
          <div className="py-3 bg-primary text-white text-center font-semibold">
            Notifications
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {notifications.length === 0 ? (
              <p className="text-center text-muted text-sm py-10">
                No notifications
              </p>
            ) : (
              notifications.map((n: Notification) => (
                <div
                  key={n.id}
                  className={`relative cursor-pointer flex gap-3 rounded-md border border-secondary/20 p-3 ${
                    n.type === "FRIENDSHIP" ? "bg-[#060220]/20" : "bg-primary/20"
                  }`}
                  onClick={() => {
                    deleteNotification(n.id);
              
                    if (n.type === "FRIENDSHIP") {
                      router.push("/settings");
                      return;
                    }
              
                    dispatch(
                      updateChatPopUp({
                        isOpen: true,
                        selectedChat: {
                          type: "direct",
                          id: n.message?.dmChatRoomId || "",
                          name: n.sender.fullName,
                        },
                      })
                    );
                  }}
                >
                  {/* Avatar */}
                  <Avatar
                    className="!w-9 !h-9 flex-shrink-0"
                    fullName={n.sender.fullName}
                    avatar={n.sender.avatar}
                  />
              
                  {/* Name + Message */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-medium text-primary">
                      {n.sender.fullName}
                    </span>
              
                    <p
                      className={`mt-1 truncate ${
                        n.type === "FRIENDSHIP"
                          ? "text-white text-sm"
                          : "text-secondary text-sm"
                      }`}
                    >
                      {n.content}
                    </p>
                  </div>
              
                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))              
            )}
          </div>
        </div>
      )}

      {/* User Avatar */}
      <div className="flex items-center gap-2">
        <Avatar fullName={fullName} avatar={avatar} className="!w-9 !h-9 cursor-pointer" username={username} getInfo={true} />
      </div>

      {/* Name */}
      <div className="hidden md:flex items-center text-primary font-semibold text-sm truncate">
        {fullName}
      </div>
    </div>
  );
}

export default memo(AvatarNotify);
