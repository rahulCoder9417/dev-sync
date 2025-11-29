import React, { useState } from 'react'
import Avatar from '../main/Avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Upload } from 'lucide-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { showToast } from '../main/Toast';
import { useEffect } from 'react';
import { updateProfile } from '@/lib/actions/user/userUpdation';
import { updateUserInfo } from '@/lib/redux/features/userSlice';

const Profile = () => {
  const user = useAppSelector((state) => state.user);
  const [fullName, setFullName] = useState(user.fullName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const dispatch = useAppDispatch();
  const [avatar, setAvatar] = useState<string | null>(user.avatar);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
  
      const previewUrl = URL.createObjectURL(file);
  setAvatar(previewUrl);
    }
  };
  useEffect(() => {
    setFullName(user.fullName || "");
    setUsername(user.username || "");
    setBio(user.bio || "");
    setAvatar(user.avatar || null);
  }, [user]);
  return (
    <div className="p-6 rounded-xl border bg-[#413e4b] border-primary">
      <h2 className="text-lg font-semibold mb-6 text-primary">
        Edit Profile
      </h2>

      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar
            fullName={fullName}
            username={username}
            avatar={avatar}
            className="w-20 h-20 !text-2xl"
          />
          <div className="flex-1">
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex items-center gap-2 text-primary border-secondary bg-hover px-4 py-2 rounded-lg border transition-colors hover:bg-opacity-80 w-fit"
              >
                <Upload className="w-4 h-4" />
                Upload Avatar
              </div>
            </Label>
            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
            <p className="text-xs mt-2 text-muted">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor="fullname" className="text-primary">
            Full Name
          </Label>
          <Input
            id="fullname"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 bg-primary text-primary text-lg border-primary "
            placeholder="Enter your full name"
          />
        </div>

        {/* Username (Read-only) */}
        <div>
          <Label htmlFor="username" className="text-primary">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            disabled
            className="mt-2 bg-primary text-primary text-lg border-primary "
            style={{ opacity: 0.6 }}
          />
          <p className="text-xs mt-1 text-muted" >
            Username cannot be changed
          </p>
        </div>

        {/* Bio */}
        <div>
          <Label htmlFor="bio" className="text-primary">
            Bio
          </Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-2 min-h-[120px] bg-primary text-primary text-lg border-primary "
            placeholder="Tell us about yourself"
          />
          <p className="text-xs mt-1 text-muted">
            {bio.length}/500 characters
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/profile/${username}`}>
            <Button variant="outline">
              Cancel
            </Button>
          </Link>
          <form
            action={async () => {
              const res = await updateProfile({
                username,
                fullName,
                bio,
                avatar:avatarFile,
              });

              if (res.success) {
                showToast(true,"Profile updated!");
                dispatch(updateUserInfo({fullName,bio,avatar : res.avatarUrl || avatar }));
              } else {
                showToast(false,"Something went wrong.",res.error as string);
              }
            }}
          >
            <Button type="submit">
              Save Changes
            </Button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default Profile
