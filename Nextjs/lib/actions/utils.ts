import db from "@/lib/db/prisma";
export async function createFriendNotification(
    senderId: string,
    receiverId: string,
    content: string
  ) {
    await db.notification.create({
      data: {
        senderId,
        receiverId,
        type: 'FRIENDSHIP',
        content,
      },
    });
  }
  