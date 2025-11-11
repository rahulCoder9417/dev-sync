import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export async function GET(req: NextRequest) {
  try {
    const dbUser = await middleWare();
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const chatType = searchParams.get("chatType"); // 'team' or 'direct'
    const chatId = searchParams.get("chatId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "30");

    if (!chatType || !chatId) {
      return NextResponse.json(
        { error: "chatType and chatId are required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    let messages, totalCount;

    if (chatType === "team") {
      // Verify user is a member of the team
      const teamMember = await db.teamMember.findFirst({
        where: { teamId: chatId, userId: dbUser.id },
      });

      if (!teamMember) {
        return NextResponse.json(
          { error: "You are not a member of this team" },
          { status: 403 }
        );
      }

      // Fetch team messages (exclude deleted ones for this user)
      [messages, totalCount] = await Promise.all([
        db.message.findMany({
          where: {
            teamId: chatId,
            NOT: {
              isDeletedBy: { some: { id: dbUser.id } },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            content: true,
            createdAt: true,
            isRead: true,
            updatedAt: true,
            sender: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
              },
            },
          },
        }),
        db.message.count({
          where: {
            teamId: chatId,
            NOT: {
              isDeletedBy: { some: { id: dbUser.id } },
            },
          },
        }),
      ]);
    } 
    else if (chatType === "direct") {
      // Verify user is part of the friendship
      const friendship = await db.friendship.findFirst({
        where: {
          id: chatId,
          status: "accepted",
          OR: [{ initiatorId: dbUser.id }, { receiverId: dbUser.id }],
        },
      });

      if (!friendship) {
        return NextResponse.json(
          { error: "Friendship not found or not accepted" },
          { status: 403 }
        );
      }

      // Fetch DM messages (exclude deleted ones for this user)
      [messages, totalCount] = await Promise.all([
        db.message.findMany({
          where: {
            dmChatRoomId: chatId,
            NOT: {
              isDeletedBy: { some: { id: dbUser.id } },
            },
          },
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
          select: {
            id: true,
            content: true,
            createdAt: true,
            updatedAt: true,
            isRead: true,
            sender: {
              select: {
                id: true,
                fullName: true,
                username: true,
                avatar: true,
              },
            },
          },
        }),
        db.message.count({
          where: {
            dmChatRoomId: chatId,
            NOT: {
              isDeletedBy: { some: { id: dbUser.id } },
            },
          },
        }),
      ]);
    } 
    else {
      return NextResponse.json(
        { error: "Invalid chatType. Must be 'team' or 'direct'" },
        { status: 400 }
      );
    }

    // Reverse to show oldest first
    let reversedMessages = messages.reverse();

    // Mark received direct messages as read
    if (chatType === "direct") {
      for (let i = reversedMessages.length - 1; i >= 0; i--) {
        const msg = reversedMessages[i];
        if (msg.sender.id === dbUser.id) break;

        await db.message.update({
          where: { id: msg.id },
          data: { isRead: true },
        });

        msg.isRead = true;
      }
    }

    return NextResponse.json({
      messages: reversedMessages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalMessages: totalCount,
        hasMore: skip + messages.length < totalCount,
        limit,
      },
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
