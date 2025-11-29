import { currentUser } from "@clerk/nextjs/server";

import db from "@/lib/db/prisma"
export async function GET(req:Request){
    const user = await currentUser();

if (!user?.emailAddresses?.[0]?.emailAddress) {
  throw new Error("Unauthorized");
}

const email = user.emailAddresses[0].emailAddress;
const dbUser = await db.user.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });
  

if (!dbUser) {
  throw new Error("User not found");
}

const friends = await db.friendship.findMany({
    where: {
      AND: [
        {
          OR: [
            { initiatorId: dbUser.id },
            { receiverId: dbUser.id }
          ]
        },
        {
          status: "accepted"
        }
      ]
    },
    include: {
      initiator: {
        select: { id: true, fullName: true, avatar: true }
      },
      receiver: {
        select: { id: true, fullName: true, avatar: true }
      }
    }
  });

  if (!friends || friends.length === 0) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  const friendList = friends.map(friend => {
    const other = friend.initiatorId === dbUser.id ? friend.receiver : friend.initiator;
    return {
      id: other.id,
      fullName: other.fullName,
      avatar: other.avatar
    };
  });

  return new Response(JSON.stringify(friendList), {
    status: 200,
    headers: {
      "Content-Type": "application/json"
    }
  });
}
