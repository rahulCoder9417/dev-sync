
import db from "@/lib/db/prisma";
import { createFriendNotification } from "@/lib/actions/utils";

export async function findFriendship(userId: string, friendId: string) {
    return db.friendship.findFirst({
      where: {
        OR: [
          { initiatorId: userId, receiverId: friendId },
          { initiatorId: friendId, receiverId: userId },
        ],
      },
    });
  }
  export async function unfriend(
    userId: string,
    friendId: string,
    friendshipId: string
  ) {
    await db.friendship.delete({
      where: { id: friendshipId },
    });
  
    await createFriendNotification(
      userId,
      friendId,
      'removed you as a friend.'
    );
  }
  export async function acceptFriend(
    userId: string,
    friendId: string,
    friendship: { id: string; status: string }
  ) {
    if (friendship.status !== 'pending') {
      throw new Error('Friend request already accepted');
    }
  
    await db.friendship.update({
      where: { id: friendship.id },
      data: { status: 'accepted' },
    });
  
    await createFriendNotification(
      userId,
      friendId,
      'accepted your friend request.'
    );
  }
      