import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
import { NextResponse } from "next/server";
import db from "@/lib/db/prisma";

export async function PUT(request: Request) {
 const {userId,action} = await request.json();
 const dbUser = await middleWare();
 if(!dbUser){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
 }
 try {
    if(action === "accept"){
        const friendship = await db.friendship.update({
            where: {
                initiatorId_receiverId: {
                    initiatorId: userId,
                    receiverId: dbUser.id,
                },
            },
            data: {
                status: "accepted",
            },
        })
        if(!friendship){
            return NextResponse.json({ error: "Failed to accept friendship" }, { status: 500 });
        }
    }else if(action === "reject"){
        const friendship = await db.friendship.deleteMany({
            where: {
                OR:[{
                    initiatorId: dbUser.id,
                    receiverId: userId,
                },{
                    initiatorId: userId,
                    receiverId: dbUser.id,
                }]
            },
        });
        if(!friendship){
            return NextResponse.json({ error: "Failed to rekject friendship" }, { status: 500 });
        }
    }else{
        const friendship = await db.friendship.create({
            data: {
                initiatorId: dbUser.id,
                receiverId: userId,
                status: "pending",
            },
        });
        if(!friendship){
            return NextResponse.json({ error: "Failed to create friendship" }, { status: 500 });
        }
       
        
    }
    await db.notification.create({
        data: {
            senderId: dbUser.id,
            receiverId: userId,
            type: "FRIENDSHIP",
            content: "Friendship " + action,
            
        },
    });
 } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    
 }
}