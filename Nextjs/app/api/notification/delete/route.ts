import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db/prisma';
import { middleWare } from '@/lib/mainUtils/beckendMiddleWare';

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const dbUser = await middleWare();
    if (!dbUser) {
      throw new Error('User not found');
    }
    await db.notification.deleteMany({
      where: {
        id,
        receiverId: dbUser.id, 
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Notification delete failed:', error);
    return NextResponse.json(
      { error: 'Failed to delete notification' +error },
      { status: 500 }
    );
  }
}
