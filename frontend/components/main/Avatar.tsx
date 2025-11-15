"use client";
import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';
import React, { useState } from 'react';

const A = ({ fullName, avatar, className = "" }: { fullName: string; avatar?: string | null; className?: string }) => {
  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0]?.toUpperCase();
    return parts[0][0]?.toUpperCase() + parts[1][0]?.toUpperCase();
  };
  if (avatar) {
    return (
      <div
        className={`w-6 h-6 rounded-full border-2 flex ${className} bg-cover bg-center items-center justify-center text-xs font-medium text-white hover:z-10 transition-all hover:scale-110`}
        style={{ backgroundImage: `url(${avatar})`, }}
      />
    );
  }

  return (
    <div
      className={`w-6 h-6 rounded-full border-2 ${className} border-[#171616] flex items-center justify-center text-xs font-medium bg-gradient-to-r from-blue-400 to-purple-500 text-primary hover:z-10 transition-all hover:scale-110`}

    >
      {getInitials(fullName)}
    </div>
  );
};

export default function Avatar({
  fullName,
  username,
  avatar,
  className = "",
  getStatus,
  status,
  getInfo,
}: {
  fullName: string;
  username?: string;
  avatar?: string | null;
  className?: string;
  getStatus?: boolean;
  status?: "online" | "offline";
  getInfo?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => getInfo && setHovered(true)}
      onMouseLeave={() => getInfo && setHovered(false)}
    >
      {/* Avatar */}
      <div className="relative">
        <A fullName={fullName} avatar={avatar} className={className} />

        {/* Online/Offline Dot */}
        {getStatus && (
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2`}
            style={{
              borderColor: "var(--bg-card)",
              backgroundColor:
                status === "online"
                  ? "var(--success)"
                  : "var(--text-muted)",
            }}
          />
        )}
      </div>

      {/* Hover Card */}
      {getInfo && hovered && (
        <div
          className="absolute left-16 -translate-x-1/2  w-24 p-3 rounded-2xl shadow-md bg-[var(--bg-card)] border border-[var(--border-secondary)] z-50 transition-all animate-fade-in"
        >
          <div className="flex flex-col">
            <span className="text-[var(--text-primary)] font-semibold text-sm">
              {fullName}
            </span>
            {username && (
              <>
              <span className="text-[var(--text-muted)] text-xs">
                @{username}
              </span>
              <Link href={`/profile/${username}`}>
              <LinkIcon
              className='mt-3  w-full text-center text-sm font-medium rounded-xl py-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-secondary)] text-white transition'
              />
              </Link>
            </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
