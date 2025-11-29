"use server";

import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export default async function getDMAndTeam() {
  const dbUser = await middleWare();
  if (!dbUser) throw new Error("Unauthorized");

  const teams = await db.team.findMany({
    where: {
      members: {
        some: { userId: dbUser.id },
      },
    },
    select: {
      id: true,
      projects:{
        select:{
          id:true,
          
        }
      },
      name: true,
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
        take: 1, // just the latest message
        select: {
          isRead: true,
          createdAt: true,
        },
      },
      updatedAt: true,
    },
  });
  const formattedTeams = teams
    .filter((team) => team._count.members >= 2)
    .map((team) =>{
      return({
      type: "team",
      id: team.id,
      name: team.name,
      projectId:team.projects[0]?.id  || "",
      memberCount: team._count.members,
      lastMessage: team.messages[0]?.isRead ,
      lastMessageAt: team.messages[0]?.createdAt || team.updatedAt,
    })});

  /* -------------------- FRIENDSHIPS (DMs) -------------------- */
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
      updatedAt: true,
    },
  });

  const formattedFriends = friendships.map((f) => {
    const friend = f.initiator.id === dbUser.id ? f.receiver : f.initiator;
    return {
      type: "dm",
      id: f.id,
      userId: friend.id,
      fullName: friend.fullName,
      username: friend.username,
      avatar: friend.avatar,
      lastMessage: f.messages[0]?.senderId === dbUser.id || f.messages[0]?.isRead,
      lastMessageAt: f.messages[0]?.createdAt || f.updatedAt,
    };
  });


  return {teams:formattedTeams,friends:formattedFriends};
}
