import { NextResponse } from "next/server";
import db from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
export async function GET(
  request: Request,
) {
  try {
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
    };

    if (!dbUser.id) {
      return NextResponse.json(
        { error: "Receiver ID is required" },
        { status: 400 }
      );
    }

    const notifications = await db.notification.findMany({
      where: {   receiverId:dbUser.id },
      orderBy: { createdAt: "desc" },
      select:{
        id:true,
        createdAt:true,
        content:true,
        sender:{
          select:{
                id:true,
                fullName:true,
                avatar:true,
                username:true,
          }
        },
      }
    });

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
