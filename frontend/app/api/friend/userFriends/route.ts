import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
import { NextResponse } from "next/server";
import db from "@/lib/db/prisma";

export async function GET({ req }: { req: Request }) {
    const dbUser = await middleWare();
    if (!dbUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const friendships = await db.friendship.findMany({
        where: {
            OR: [
                { initiatorId: dbUser.id },
                { receiverId: dbUser.id }
            ],
            NOT: {
                status: "blocked"
            }
        },
        select: {
            id: true,
            initiatorId: true,
            initiator: {
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatar: true
                }
            },
            receiverId: true,
            receiver: {
                select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatar: true
                }
            },
            status: true,
            createdAt: true,
            updatedAt: true
        }
    });

    // Normalize → return only the OTHER user
    const userFriends = friendships.map(f => {
      
         const other = f.initiatorId === dbUser.id ? f.receiver : f.initiator;


        return {
          id: other.id,
          friendshipId: f.id,
          createdAt: f.createdAt,
          fullName: other.fullName,
          username: other.username,
          avatar: other.avatar,
          status: f.status
        };
    });

    return NextResponse.json({ userFriends });
}
