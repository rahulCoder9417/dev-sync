import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db/prisma";
export async function DELETE(req: NextRequest) {
    const { id } = await req.json();
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
        db.notification.deleteMany({
            where: { id },
          });
          return NextResponse.json({ message: "Notification deleted successfully" });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return NextResponse.json(
          { error: "Failed to delete notification" },
          { status: 500 }
        );
      }
}
