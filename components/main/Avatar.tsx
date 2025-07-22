import React from 'react';

const Avatar = ({ fullName, avatar,className="" }: { fullName: string; avatar?: string | null;className?:string }) => {
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

export default Avatar;