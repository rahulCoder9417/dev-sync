import { NextResponse } from "next/server";
import db from "@/lib/db/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
export async function GET(
  request: Request,
) {
  try {
    const dbUser = await middleWare()
    
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    };

    // dbUser.id will always be present due to select above

    const notifications = await db.notification.findMany({
      where: {   receiverId:dbUser.id },
      orderBy: { createdAt: "desc" },
      select:{
        id:true,
        createdAt:true,
        content:true,
        type:true,
        sender:{
          select:{
                id:true,
                fullName:true,
                avatar:true,
                username:true,
          }
        },
        message:{
          select:{
              teamId:true,
              team:{
                select:{
                  name:true
                }
              },
              dmChatRoomId:true,
          }
        }
        
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
