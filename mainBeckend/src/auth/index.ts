import { verifyToken } from "@clerk/backend";
import { UserMeta } from "../../types";
import { getUserByEmail } from "../../lib/action/user/getUser";

export async function getAuthData(token: string):Promise<UserMeta | null> {
  try {
    //email will be got beacause of jwt template
    const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      
      const email = payload.email as string;

      if(!email){
        throw new Error("User not found  - payload email" );
      }

      const response:any = await getUserByEmail(email)

      if(!response){
        throw new Error("User not found" + response.error );
      }
      return {
        userId: response.id,
        username: response.username,
        avatar:response.avatar,
        fullName: response.fullName,
      };
      
  } catch (error) {
    console.log("Error happend finding user",error)
    return null
  }
}