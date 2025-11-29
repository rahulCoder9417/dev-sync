import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export async function GET(req: Request) {
  const { search, type } = Object.fromEntries(new URL(req.url).searchParams);
  const user = await middleWare();

  if (!user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!search || search.trim().length === 0) {
    return Response.json({ teams: [], users: [] });
  }

  const prefix = search.toLowerCase();

  if (type === "team") {
    const teams = await db.team.findMany({
      where: {
        name: { startsWith: prefix, mode: "insensitive" },
        members: {
          none: { userId: user.id } // not member
        }
      },
      select: {
        id: true,
        name: true,
      },
      take: 10
    });

    return Response.json({ teams, users: [] });
  }

  const users = await db.user.findMany({
    where: {
      OR: [
        { fullName: { contains: prefix, mode: "insensitive" } },
        { username: { startsWith: prefix, mode: "insensitive" } }
      ],
      AND: [
        { id: { not: user.id } },
  
        {
          friendshipsInitiated: {
            none: { receiverId: user.id }
          }
        },
        {
          friendshipsReceived: {
            none: { initiatorId: user.id }
          }
        }
      ]
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatar: true
    },
    take: 10
  });
  

  return Response.json({ teams: [], users });
}
