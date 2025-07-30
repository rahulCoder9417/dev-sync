"use client";
import React from "react";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks"; // ✅ typed useSelector

const AvatarNotify = () => {
  const fullName = useAppSelector((state) => state.user.fullName);
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return parts[0][0]?.toUpperCase() + parts[1][0]?.toUpperCase();
  };

  const initials = getInitials(fullName || "User");

  return (
    <div className="bg-inherit flex  gap-5 md:gap-10 md:mr-5">
      {/* Bell icon */}
      <Button variant="ghost" size="icon" className="relative cursor-pointer mt-2">
        <Bell className="w-5 h-5 md:w-10 md:h-6" />
        <span
          className="absolute -top-1 -right-1 w-3 h-3 p-2 rounded-full text-xs flex items-center justify-center text-white"
          style={{ background: "var(--error)" }}
        >
          3
        </span>
      </Button>

      {/* User avatar with initials */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {initials}
        </div>
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
