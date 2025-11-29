import { verifyToken } from "@clerk/backend";
import { db } from "../lib/db/db";

export async function getAuthData(token: string):Promise<string | null> {
  try {
    //email will be got beacause of jwt template
    const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      
      const email = payload.email as string;

      if(!email){
        throw new Error("User not found  - payload email" );
      }

      const user = await db.user.findUnique({
        where: {
          email: email
        },
        select: {
          id: true,
        }
      })
      if (!user) return null;
      return user.id
      
  } catch (error) {
    console.log("Error happend finding user",error)
    return null
  }
}