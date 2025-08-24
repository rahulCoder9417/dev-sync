import { verifyToken } from "@clerk/backend";
import { UserMeta } from "../../types";

export async function getAuthData(token: string):Promise<UserMeta | null> {
  try {
    //email will be got beacause of jwt template
    const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      const email = payload.email;
      if(!email){
        throw new Error("User not found  - payload email" );
      }
      const response = await fetch(`${process.env.FRONTEND_URL}/api/user/findUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" ,
            "x-internal-api-key":process.env.INTERNAL_API_KEY!,
        },
        body: JSON.stringify({ identifier:email }),
      });
      if(!response.ok){
        throw new Error("User not found");
      }

      const data = await response.json();
      if(!data.success){
        throw new Error("User not found");
      }
      return {
        userId: data.user.id,
        username: data.user.username,
        fullName: data.user.fullName,
      };
  } catch (error) {
    console.log("Error happend finding user",error)
    return null
  }
}