'use server';

import prisma from '@/lib/db/prisma';
import { uploadToCloudinary } from '@/lib/mainUtils/cloudinary';
import { UpdateProfileInput, UpdateProfileResult } from '@/lib/types/settings';
import { updateProfileSchema } from '@/schema/settings/profileSchema';
async function handleAvatarUpload(
  avatar: File | null,
  username: string
): Promise<string | null> {
  if (!avatar || avatar.size === 0) return null;

  const buffer = Buffer.from(await avatar.arrayBuffer());

  const uploadRes = await uploadToCloudinary({
    buffer,
    filename: `${username}_avatar`,
    folder: '/avatars',
    type: 'image',
  });

  if (!uploadRes.success) {
    throw new Error(uploadRes.error || 'Avatar upload failed');
  }

  return uploadRes.secure_url ?? null;
}

/* -------------------------------------------------------------------------- */
/*                                Action                                      */
/* -------------------------------------------------------------------------- */

export async function updateProfile(
  rawData: UpdateProfileInput
): Promise<UpdateProfileResult> {
  try {
    const data = updateProfileSchema.parse(rawData);

    if(data.avatar?.size){
      const maxSize = 1 * 1024 * 1024; 
      
      if(data.avatar.size > maxSize){
        return {
          success: false,
          error:
            "Avatar size must be less than 1MB"
        };
      }
    }
    const avatarUrl = await handleAvatarUpload(
      data.avatar,
      data.username
    );

    const updatedUser = await prisma.user.update({
      where: { username: data.username },
      data: {
        fullName: data.fullName,
        bio: data.bio,
        ...(avatarUrl && { avatar: avatarUrl }),
      },
    });

    return {
      success: true,
      user: updatedUser,
      avatarUrl,
    };
  } catch (error) {
    console.log('[UPDATE_PROFILE_FAILED]', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update profile',
    };
  }
}
