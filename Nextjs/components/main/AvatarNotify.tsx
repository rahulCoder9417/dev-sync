'use client';

import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { shallowEqual } from 'react-redux';

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

  const { fullName, avatar, notifications } = useAppSelector(
    (state) => state.user,
    shallowEqual
  );

  const [isOpen, setIsOpen] = useState(false);

  /* -------------------------------- Utilities ------------------------------- */

  const getInitials = useCallback((name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? '';
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, []);

  const initials = getInitials(fullName || 'User');

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
                <Link
                href={n.type === "FRIENDSHIP" ? "/settings" : "#"}
                onClick={(e) => {
                  
                  deleteNotification(n.id);
                  if (n.type === "FRIENDSHIP") {
                    e.preventDefault();
                  }
                }}
                prefetch={false}
                key={n.id}
              >
                            
                  <div
                    className={`relative cursor-pointer my-2 flex flex-col rounded-md border border-secondary/20 p-3  ${n.type === "FRIENDSHIP" ? "bg-[#060220]/20" : "bg-primary/20"}`}
                    onClick={()=>{
                      dispatch(updateChatPopUp({
                        isOpen:true,
                        selectedChat:{
                          type:"direct",
                          id:n.message?.dmChatRoomId || "",
                          name: n.sender.fullName
                        }
                      }))
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <Avatar
                          className="!w-9 !h-9"
                          fullName={n.sender.fullName}
                          avatar={n.sender.avatar}
                        />
                        <span className="text-sm text-primary font-medium">
                          {n.sender.fullName}
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(n.id);
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className={`mt-2 truncate ${n.type === "FRIENDSHIP" ? "text-white text-md" : "text-sm text-secondary "}`}>
                      {n.content}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}

      {/* User Avatar */}
      <div className="flex items-center gap-2">
        {avatar ? (
          <img
            src={avatar}
            alt={fullName || 'User'}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
        )}
      </div>

      {/* Name */}
      <div className="hidden md:flex items-center text-primary font-semibold text-lg">
        {fullName}
      </div>
    </div>
  );
}

export default memo(AvatarNotify);
