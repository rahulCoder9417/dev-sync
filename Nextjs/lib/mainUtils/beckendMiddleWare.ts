import { currentUser } from "@clerk/nextjs/server";
import db from "@/lib/db/prisma"

export const middleWare = async () => {
    
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
      
  
    return dbUser
}