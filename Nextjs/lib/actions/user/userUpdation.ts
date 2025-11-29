"use server";

import prisma from "@/lib/db/prisma";
import { uploadToCloudinary } from "@/lib/mainUtils/cloudinary";

export async function updateProfile(data: {
  username: string;
  fullName: string;
  bio: string;
  avatar: File | null;
}) {
  let avatarUrl: string | null = null;

  // If a new avatar file exists -> upload it
  if (data.avatar && data.avatar.size > 0) {
    const arrayBuffer = await data.avatar.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadRes = await uploadToCloudinary({
      buffer,
      filename: data.username + "_avatar",
      folder: "/avatars",
      type: "image",
    });

    if (!uploadRes.success) {
      return { success: false, error: uploadRes.error };
    }

    avatarUrl = uploadRes.secure_url!;
  }

  try {
    const updated = await prisma.user.update({
      where: { username: data.username },
      data: {
        fullName: data.fullName,
        bio: data.bio,
        ...(avatarUrl ? { avatar: avatarUrl } : {}),
      },
    });

    return { success: true, user: updated, avatarUrl };
  } catch (err) {
    return { success: false, message: "Failed to update profile", error: err };
  }
}
