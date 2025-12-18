"use client";

import { useEffect, useState, ChangeEvent } from "react";
import Link from "next/link";
import { Upload } from "lucide-react";

import Avatar from "../main/Avatar";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { showToast } from "../main/Toast";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateUserInfo } from "@/lib/redux/features/userSlice";
import { updateProfile } from "@/lib/actions/user/userUpdation";

type ProfileFormState = {
  fullName: string;
  username: string;
  bio: string;
  avatar: string | null;
};

export default function Profile() {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<ProfileFormState>({
    fullName: "",
    username: "",
    bio: "",
    avatar: null,
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  /* ---------------- Sync Redux → Local Form ---------------- */
  useEffect(() => {
    setForm({
      fullName: user.fullName || "",
      username: user.username || "",
      bio: user.bio || "",
      avatar: user.avatar || null,
    });
  }, [user]);

  /* ---------------- Handlers ---------------- */
  const handleChange =
    (key: keyof ProfileFormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);
    setForm((prev) => ({
      ...prev,
      avatar: URL.createObjectURL(file),
    }));
  };

  /* ---------------- Submit ---------------- */
  async function handleSubmit() {
    const res = await updateProfile({
      username: form.username,
      fullName: form.fullName,
      bio: form.bio,
      avatar: avatarFile,
    });

    if (!res.success) {
      showToast(false, "Something went wrong.", res.error as string);
      return;
    }

    showToast(true, "Profile updated!");
    dispatch(
      updateUserInfo({
        fullName: form.fullName,
        bio: form.bio,
        avatar: res.avatarUrl || form.avatar,
      })
    );
  }

  return (
    <section className="rounded-xl border border-primary bg-[#413e4b] p-6">
      <h2 className="mb-6 text-lg font-semibold text-primary">Edit Profile</h2>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <Avatar
            fullName={form.fullName}
            username={form.username}
            avatar={form.avatar}
            className="h-20 w-20 !text-2xl"
          />

          <div>
            <Label htmlFor="avatar" className="cursor-pointer">
              <div className="flex w-fit items-center gap-2 rounded-lg border border-secondary bg-hover px-4 py-2 text-primary transition hover:bg-opacity-80">
                <Upload className="h-4 w-4" />
                Upload Avatar
              </div>
            </Label>

            <input
              id="avatar"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              hidden
            />

            <p className="mt-2 text-xs text-muted">
              JPG, PNG or GIF. Max size 2MB
            </p>
          </div>
        </div>

        {/* Full Name */}
        <Field label="Full Name">
          <Input
            value={form.fullName}
            onChange={handleChange("fullName")}
            placeholder="Enter your full name"
            className="bg-primary text-lg text-primary border-primary"
          />
        </Field>

        {/* Username */}
        <Field label="Username">
          <Input
            value={form.username}
            disabled
            className="bg-primary text-lg text-primary border-primary opacity-60"
          />
          <p className="mt-1 text-xs text-muted">Username cannot be changed</p>
        </Field>

        {/* Bio */}
        <Field label="Bio">
          <Textarea
            value={form.bio}
            onChange={handleChange("bio")}
            placeholder="Tell us about yourself"
            className="min-h-[120px] bg-primary text-lg text-primary border-primary"
          />
          <p className="mt-1 text-xs text-muted">
            {form.bio.length}/500 characters
          </p>
        </Field>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/profile/${form.username}`}>
            <Button variant="outline">Cancel</Button>
          </Link>

          <form action={handleSubmit}>
            <Button type="submit">Save Changes</Button>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Small UI Helper ---------------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-primary">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}
