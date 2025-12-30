import { NextResponse } from "next/server";
import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

/**
 * GET /api/friendships
 * Returns all non-blocked friendships normalized to "other user"
 */
export async function GET() {
  try {
    const dbUser = await middleWare();

    if (!dbUser) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const friendships = await db.friendship.findMany({
      where: {
        OR: [
          { initiatorId: dbUser.id },
          { receiverId: dbUser.id },
        ],
        status: {
          not: "blocked",
        },
      },
      select: {
        id: true,
        status: true,
        createdAt: true,

        initiatorId: true,
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
      },
    });

    const userFriends = friendships.map((f) => {
      const isInitiator = f.initiatorId === dbUser.id;
      const otherUser = isInitiator ? f.receiver : f.initiator;

      return {
        friendshipId: f.id,
        status: f.status,
        createdAt: f.createdAt,
        isInitiator,
        id: otherUser.id,
        fullName: otherUser.fullName,
        username: otherUser.username,
        avatar: otherUser.avatar,
      };
    });

    return NextResponse.json({ userFriends });
  } catch (error) {
    console.error("GET /friendships error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
