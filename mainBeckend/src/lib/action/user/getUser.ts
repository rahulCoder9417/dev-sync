import { db } from "../../db/db.js";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        avatar:true
      },
    });
    return user;
  } catch (error) {
    return error;
  }
}