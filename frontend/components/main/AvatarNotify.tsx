"use client";
import React from "react";
import { Button } from "../ui/button";
import { Bell, X } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks"; // ✅ typed useSelector
import { useState } from "react";
import Avatar from "./Avatar";
import { shallowEqual } from "react-redux";
import { useAppDispatch } from "@/lib/redux/hooks";
import { removeNotification } from "@/lib/redux/features/userSlice";

const AvatarNotify = () => {
  const { fullName, avatar, notifications } = useAppSelector((state) => state.user, shallowEqual);
  const [showNotification, setShowNotification] = useState(false)
  const dispatch = useAppDispatch();
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return parts[0][0]?.toUpperCase() + parts[1][0]?.toUpperCase();
  };
  const cancelNotification =async (id: string) => {
    dispatch(removeNotification(id));
    await fetch(`/api/notification/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });
  }

  const initials = getInitials(fullName || "User");

  return (
    <div className="bg-inherit flex relative gap-5 md:gap-10 md:mr-5">
      {/* Bell icon */}
      <Button onClick={() => { setShowNotification(!showNotification) }} variant="ghost" size="icon" className="relative cursor-pointer mt-2">
        <Bell className="w-5 h-5 md:w-10 md:h-6" />
        <span
          className="absolute -top-1 -right-1 w-3 h-3 p-2 rounded-full text-xs flex items-center justify-center text-white"
          style={{ background: "var(--error)" }}
        >
          {notifications.length}
        </span>
      </Button>
      {
        
        showNotification && (
          <div className="absolute top-12 right-6 w-72 max-h-96 bg-secondary border border-primary rounded-lg shadow-xl z-50 flex flex-col overflow-hidden">
  {/* Header */}
  <div className="py-3 bg-primary text-white flex justify-center items-center">
    <h2 className="text-lg font-semibold">Notifications</h2>
  </div>

  {/* Notifications List */}
  <div className="flex-1 overflow-y-auto p-3 space-y-3">
    {notifications.length > 0 ? (
      notifications.map((i) => (
        <div
          key={i.id}
          className="flex flex-col bg-[#7e7979] rounded-md border border-secondary/20 p-3 hover:bg-secondary/20 transition"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2"> 
              <Avatar
                className="!w-9 !h-9"
                fullName={i.sender.fullName}
                avatar={i.sender.avatar}
              />
              <p className="text-sm font-medium text-gray-800">
                {i.sender.fullName}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => cancelNotification(i.id)}
              className="p-1 hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </Button>
          </div>

          <p className="mt-2 text-sm text-primary">{i.content}</p>
        </div>
      ))
    ) : (
      <p className="text-center text-gray-500 text-sm py-10">No notifications</p>
    )}
  </div>
</div>

        )
      }
      {/* User avatar with initials */}
      <div className="flex items-center space-x-2">
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
      <div className="md:flex hidden items-center space-x-2">
        <div className=" font-semibold text-2xl text-primary">
          {fullName}
        </div>
      </div>


    </div>
  );
};

export default AvatarNotify;
