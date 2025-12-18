"use server";

import prisma from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export async function getUserDetails(username: string) {
  if (!username) {
    return { success: false, error: "No username provided" };
  }

  try {
    const dbUser = await middleWare();

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
      return { success: false, error: "User not found" };
    }

    const projects = user.projects.map((project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      framework: project.packages || "unknown",
      lastUpdated: project.updatedAt.toISOString(),
      type: project.type,
      isGitImport: project.isGitImport,
      collaborators:
        project.team?.members.map((m) => ({
          fullName: m.user.fullName,
          avatar: m.user.avatar,
        })) || [],
    }));


    const [friendship,totalFriends] = await Promise.all([prisma.friendship.findFirst({
        where: {
          OR:[{
            initiatorId: dbUser?.id,
            receiverId: user.id,
          },{
            initiatorId: user.id,
            receiverId: dbUser?.id,
          }
        ],},
        select: { status: true,initiatorId: true,},
      }),prisma.friendship.count({
        where: {
          OR: [
            { initiatorId: user.id },
            { receiverId: user.id },
          ],
          status: "accepted",
        },
      })])

    return {
      success: true,
      user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        bio: user.bio,
        avatar: user.avatar,
        projects,
        isFriend: friendship?.status === "pending" ? friendship?.initiatorId === dbUser?.id ? "pending" : "acceptHim" : friendship?.status || "none",
        totalFriends,
      },
    };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Server error" };
  }
}
