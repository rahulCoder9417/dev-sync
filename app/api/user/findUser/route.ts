// app/api/user/by-id/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function POST(req: Request) {
  const { identifier } = await req.json();

  if (!identifier) return NextResponse.json({ success: false, error: "No identifier provided" });

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        username: true,
      },
    });

    if (!user) return NextResponse.json({ success: false, error: "User not found" });

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
