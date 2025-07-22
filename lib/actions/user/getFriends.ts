import { currentUser } from "@clerk/nextjs/server";

import db from "@/lib/db/prisma"
export async function getFriends(){
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
      
    if (!friends) {
        throw new Error("No friends Lonely ")   
    }
    if (friends.length===0) return []
    const friendList = friends.map(friend => {
        const other = friend.initiatorId === dbUser.id ? friend.receiver : friend.initiator;
        return {
          id: other.id,
          fullName: other.fullName,
          avatar: other.avatar
        };
      });
    return friendList      
}