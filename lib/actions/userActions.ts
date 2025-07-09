"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { signUpSchema } from "@/schema/signUpSchema";



export async function saveUserToDB(rawData: unknown) {
  const parsed = signUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.format() };
  }

  const { fullName, email, username, password,passwordConfirmation } = parsed.data;
  if(password !== passwordConfirmation){
    return { success: false, message: "Passwords do not match" };
  }
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  try {
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        username,
        password: hashedPassword,
        avatar:"",
        githubUrl:"",
      },
    });

    return { success: true, message: "User created successfully" ,user};
  } catch (err: any) {
    console.error("DB Save Error:", err);
    return { success: false, error: err.message };
  }
}


export async function getUserByIdentifier(identifier: string) {
  if (!identifier) {
    return { success: false, error: "No identifier provided" };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { username: identifier },
        ],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return { success: true, user };
  } catch (err: any) {
    console.error("Error fetching user:", err);
    return { success: false, error: "Server error" };
  }
}
