'use server';

import prisma from '@/lib/db/prisma';
import { middleWare } from '@/lib/mainUtils/beckendMiddleWare';

import { Project } from '@/lib/types/projects';
import {
  GetUserDetailsResult,
  UserProfileDetails,
} from '@/lib/types/user';
import { FriendshipStatus } from '@/lib/types/friendship';

/* -------------------------------------------------------------------------- */
/*                                Action                                      */
/* -------------------------------------------------------------------------- */

export async function getUserDetails(
  username: string
): Promise<GetUserDetailsResult> {
  if (!username) {
    return { success: false, error: 'No username provided' };
  }

  try {
    const dbUser = await middleWare();
    if (!dbUser) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await prisma.user.findFirst({
      where: { username },
      select: {
        id: true,
        fullName: true,
        username: true,
        bio: true,
        avatar: true,
        projects: {
          select: {
            id: true,
            name: true,
            description: true,
            packages: true,
            updatedAt: true,
            starredBy: { select: { id: true } },
            archiveprojectBy: { select: { id: true } },
            type: true,
            isGitImport: true,
            team: {
              select: {
                members: {
                  select: {
                    user: {
                      select: {
                        fullName: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    /* ---------------- Projects Mapping ---------------- */

    const projects: Project[] = user.projects.map((project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      framework: project.packages ?? 'unknown',
      lastUpdated: project.updatedAt.toISOString(),
      type: project.type,
      isStarred: project.starredBy.some(
        (u) => u.id === dbUser.id
      ),
      isArchived: project.archiveprojectBy.some(
        (u) => u.id === dbUser.id
      ),
      isGitImport: project.isGitImport,
      collaborators:
        project.team?.members.map((m) => ({
          fullName: m.user.fullName,
          avatar: m.user.avatar,
        })) ?? [],
    }));

    /* ---------------- Friendship + Stats ---------------- */

    const [friendship, totalFriends] = await Promise.all([
      prisma.friendship.findFirst({
        where: {
          OR: [
            { initiatorId: dbUser.id, receiverId: user.id },
            { initiatorId: user.id, receiverId: dbUser.id },
          ],
        },
        select: {
          status: true,
          initiatorId: true,
        },
      }),
      prisma.friendship.count({
        where: {
          OR: [
            { initiatorId: user.id },
            { receiverId: user.id },
          ],
          status: 'accepted',
        },
      }),
    ]);

    const friendshipStatus: FriendshipStatus =
      friendship?.status === 'pending'
        ? friendship.initiatorId === dbUser.id
          ? 'pending'
          : 'acceptHim'
        : friendship?.status ?? 'none';

    /* ---------------- Response ---------------- */

    const profile: UserProfileDetails = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      projects,
      isFriend: friendshipStatus,
      totalFriends,
    };

    return { success: true, user: profile };
  } catch (error) {
    console.error('[GET_USER_DETAILS_FAILED]', error);
    return { success: false, error: 'Server error' };
  }
}
