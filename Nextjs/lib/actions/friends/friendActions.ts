"use server";

import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export const handleFriendAction = async (friendId: string, action: "accept" | "unfriend") => {
  const user = await middleWare();
  if (!user) throw new Error("Unauthorized");

  const userId = user.id;

  const friendship = await db.friendship.findFirst({
    where: {
      OR: [
        { initiatorId: userId, receiverId: friendId },
        { initiatorId: friendId, receiverId: userId }
      ]
    }
  });

  if (!friendship) throw new Error("Friendship not found");

  if (action === "unfriend") {
    await db.friendship.delete({
      where: { id: friendship.id }
    });

    await db.notification.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        type: "FRIENDSHIP",
        content: "removed you as a friend."
      }
    });

    return { success: true, message: "Unfriended" };
  }

  if (action === "accept") {
    if (friendship.status !== "pending")
      throw new Error("Friend request already accepted");

    await db.friendship.update({
      where: { id: friendship.id },
      data: { status: "accepted" }
    });

    await db.notification.create({
      data: {
        senderId: userId,
        receiverId: friendId,
        type: "FRIENDSHIP",
        content: "accepted your friend request."
      }
    });

    return { success: true, message: "Accepted" };
  }
};
