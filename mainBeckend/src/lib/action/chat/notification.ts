import { NotificationType } from "@prisma/client";
import { db } from "../../db/db"

export const createNotification = async (
  senderId: string,
  receiverId: string,
  content: string,
  type:NotificationType,
  id:string
) => {
  // Step 1: Delete any existing notification from this sender to this receiver (and team if provided)
  await db.notification.deleteMany({
    where: {
      senderId,
      receiverId,
    },
  });

  // Step 2: Count receiver's notifications
  const count = await db.notification.count({
    where: { receiverId },
  });

  // Step 3: If more than 50, delete the oldest one
  if (count >= 50) {
    const oldest = await db.notification.findFirst({
      where: { receiverId },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (oldest) {
      await db.notification.delete({
        where: { id: oldest.id },
      });
    }
  }

  // Step 4: Create the new notification
  const notification = await db.notification.create({
    data: {
      senderId,
      receiverId,
      content,
      type,
      messageId:id
    },

  });

  return notification;
};
