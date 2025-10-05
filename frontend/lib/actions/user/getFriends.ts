import db from "@/lib/db/prisma"
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
export async function getFriends(){
    const dbUser = await middleWare()
    if(!dbUser) throw new Error("Unauthorized")

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