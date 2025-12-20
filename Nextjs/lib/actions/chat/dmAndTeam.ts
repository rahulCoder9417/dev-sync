"use server";

import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
import { DMAndTeamResult, DMChatItem, TeamChatItem } from "@/lib/types/chat";

/* -------------------------------------------------------------------------- */
/*                                   Action                                   */
/* -------------------------------------------------------------------------- */

export default async function getDMAndTeam(): Promise<DMAndTeamResult> {
  const dbUser = await middleWare();
  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  /* ------------------------------ TEAM CHATS ------------------------------ */

  const teams = await db.team.findMany({
    where: {
      members: {
        some: { userId: dbUser.id },
      },
    },
    select: {
      id: true,
      name: true,
      updatedAt: true,
      projects: {
        select: { id: true },
      },
      _count: {
        select: { members: true },
      },
      messages: {
        where: {
          NOT: {
            isDeletedBy: { some: { id: dbUser.id } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          isRead: true,
          createdAt: true,
        },
      },
    },
  });

  const formattedTeams: TeamChatItem[] = teams
    .filter((team) => team._count.members >= 2)
    .map((team) => {
      const lastMessage = team.messages[0];

      return {
        type: "team",
        id: team.id,
        name: team.name,
        projectId: team.projects[0]?.id ?? "",
        memberCount: team._count.members,
        lastMessageRead: true,
        lastMessageAt: lastMessage?.createdAt ?? team.updatedAt,
      };
    });

  /* ------------------------------ DIRECT MESSAGES ------------------------------ */

  const friendships = await db.friendship.findMany({
    where: {
      status: "accepted",
      OR: [
        { initiatorId: dbUser.id },
        { receiverId: dbUser.id },
      ],
    },
    select: {
      id: true,
      updatedAt: true,
      initiator: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      messages: {
        where: {
          NOT: {
            isDeletedBy: { some: { id: dbUser.id } },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          senderId: true,
          isRead: true,
          createdAt: true,
        },
      },
    },
  });

  const formattedFriends: DMChatItem[] = friendships.map((friendship) => {
    const friend =
      friendship.initiator.id === dbUser.id
        ? friendship.receiver
        : friendship.initiator;

    const lastMessage = friendship.messages[0];

    const lastMessageRead =
      !lastMessage ||
      lastMessage.senderId === dbUser.id ||
      lastMessage.isRead;

    return {
      type: "dm",
      id: friendship.id,
      userId: friend.id,
      fullName: friend.fullName,
      username: friend.username,
      avatar: friend.avatar,
      lastMessageRead,
      lastMessageAt: lastMessage?.createdAt ?? friendship.updatedAt,
    };
  });

  /* -------------------------------------------------------------------------- */

  return {
    teams: formattedTeams,
    friends: formattedFriends,
  };
}
