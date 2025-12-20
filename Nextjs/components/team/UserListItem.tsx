"use client";

import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import Avatar from "../main/Avatar";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { shallowEqual } from "react-redux";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateChatPopUp } from "@/lib/redux/features/chatPopUpSlice";
import { fa } from "zod/v4/locales";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type DirectChatUser = {
  id: string;           // chatId (friendship id)
  userId: string;       // actual userId
  fullName: string;
  username: string;
  avatar?: string | null;
  lastMessageRead: boolean;
  lastMessageAt: Date;
};

export type SelectedChat =
  | { type: "direct"; id: string; name: string }
  | { type: "team"; id: string; name: string }
  | null;

interface UserListItemProps {
  user: DirectChatUser;
  selectedChat: SelectedChat;
  setSelectedChat: (chat: Exclude<SelectedChat, null>) => void;
  clearSearch?: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

const UserListItem = memo(function UserListItem({
  user,
  selectedChat,
  setSelectedChat,
  clearSearch,
}: UserListItemProps) {
  const dispatch = useAppDispatch();
const [lastMessageRead, setlastMessageRead] = useState<boolean>(user.lastMessageRead)
  /* ------------------------- Online Status Selector ------------------------- */

  const isOnline = useAppSelector(
    (state) => state.onlineUser.onlineUsers.includes(user.userId),
    shallowEqual
  );

  /* ------------------------ Unread Message Detection ------------------------ */

  const last = useAppSelector((state) => {
    const cache = state.chat.messagesCache.direct[user.id];
    if (!cache || cache.messages.length === 0) return false;

    const last = cache.messages[cache.messages.length - 1];
    return last
  }, shallowEqual);
  useEffect(() => {
    console.log(last,user.fullName)

    if (!last) return;
    if(!last.isRead && last.sender.id === user.userId){setlastMessageRead(false)}else{setlastMessageRead(true)}
  }, [last])

  /* ------------------------------ Handlers --------------------------------- */

  const selectChat = useCallback(() => {
    setSelectedChat({
      type: "direct",
      id: user.id,
      name: user.fullName,
    });
    clearSearch?.();
  }, [setSelectedChat, user, clearSearch]);

  const openPopup = useCallback(() => {
    dispatch(
      updateChatPopUp({
        isOpen: true,
        selectedChat: {
          type: "direct",
          id: user.id,
          name: user.fullName,
        },
      })
    );
  }, [dispatch, user]);

  /* -------------------------------------------------------------------------- */

  const isSelected =
    selectedChat?.type === "direct" && selectedChat.id === user.id;

  return (
    <div className="relative hover:bg-hover rounded-lg">
      <button
        onClick={selectChat}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
          ${isSelected ? "bg-hover" : "hover:bg-primary"}`}
      >
        <Avatar
          fullName={user.fullName}
          avatar={user.avatar}
          username={user.username}
          className="!w-10 !h-10"
          getInfo
          getStatus
          status={isOnline ? "online" : "offline"}
        />

        <div className="flex-1 text-left">
          <p className="font-medium text-primary">{user.fullName}</p>
          <p className="text-xs text-secondary">@{user.username}</p>
        </div>
      </button>

      {/* Unread Indicator */}
      {!lastMessageRead && (
        <span className="absolute right-16 max-md:right-2 max-md:top-3 top-5 size-3 rounded-full bg-blue-600" />
      )}

      {/* Quick Send */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 hover:bg-hover max-md:hidden"
        onClick={openPopup}
      >
        <Send className="h-5 w-5" />
      </Button>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/*                              Memo Comparison                                */
/* -------------------------------------------------------------------------- */

UserListItem.displayName = "UserListItem";

export default UserListItem;
