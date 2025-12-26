import { db } from "../../db/db.js";

export default async function getFriends(userId: string) {
  try {
    const friends = await db.friendship.findMany({
      select: {
        initiatorId: true,
        receiverId: true,
      },
      where: {
        OR: [
          {
            initiatorId: userId,
          },
          {
            receiverId: userId,
          },
        ],
        status: "accepted",
      },
    });
    if (!friends) throw new Error();
    return friends.map((friend) => {
      return friend.initiatorId === userId
        ? friend.receiverId
        : friend.initiatorId;
    });
  } catch (error) {
    return [];
  }
}
