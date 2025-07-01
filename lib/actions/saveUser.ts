"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/db/prisma";
import { signUpSchema } from "@/schema/signUpSchema";

export async function saveUserToDB(rawData: unknown) {
  const parsed = signUpSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.format() };
  }

  const { fullName, email, username, password, avatar, githubUrl,passwordConfirmation } = parsed.data;
  if(password !== passwordConfirmation){
    return { success: false, message: "Passwords do not match" };
  }
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

  try {
    await prisma.user.create({
      data: {
        fullName,
        email,
        username,
        password: hashedPassword,
        avatar,
        githubUrl,
      },
    });

    return { success: true, message: "User created successfully" };
  } catch (err: any) {
    console.error("DB Save Error:", err);
    return { success: false, error: err.message };
  }
}
