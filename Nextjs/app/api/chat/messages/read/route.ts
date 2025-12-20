import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const dbUser = await middleWare();
        if (!dbUser) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { messageId } = await req.json();
        if (!messageId) {
          return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
        }
        const message = await db.message.update({
          where: { id: messageId },
          data: { isRead: true },
        });
        return NextResponse.json({ message });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}