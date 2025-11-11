import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db/prisma";
import { NextResponse } from "next/server";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
// make a route to delete messages
export async function DELETE(request: Request) {
  const { messageId ,forEveryone,chatId,chatType} = await request.json();
  const user = await middleWare();
  if (!user) return NextResponse.json({error:"Unauthorized"}, { status: 401 });
  try {
    let deletedMembers = [user.id]
    if(forEveryone){
        if(chatType === "direct"){
            const dm = await db.friendship.findUnique({
                where: {
                    id: chatId,
                },
                select: {
                    initiatorId: true,
                    receiverId: true,
                }
            })
            if(!dm) return NextResponse.json({error:"Chat not found"}, { status: 404 });
            deletedMembers.push(dm.initiatorId === user.id ? dm.receiverId : dm.initiatorId)
        }else{
            const team = await db.team.findUnique({
                where: {
                    id: chatId,
                },
                select: {
                    members: {
                        select:{
                            id:true
                        },
                    },
                }
            })
            if(!team) return NextResponse.json({error:"Chat not found"}, { status: 404 });
            team.members.forEach((m) => m.id !== user.id && deletedMembers.push(m.id))
        }
    }

    const deletedMessage = await db.message.update({
        where: { id: messageId },
        data: {
          isDeletedBy: {
            connect: deletedMembers.map((id) => ({ id:id })),
          },
        },
      });
    if (!deletedMessage) {
      return NextResponse.json({error:"Message not found"}, { status: 404 });
    }
    return NextResponse.json({message:"Message deleted"},{status:200});
  } catch (error) {
    return NextResponse.json({error:"Internal Server Error" +error}, { status: 500 });
  }
}
