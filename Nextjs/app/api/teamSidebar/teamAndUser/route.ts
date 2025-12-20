import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get("search")?.trim();
  const type = url.searchParams.get("type");

  const user = await middleWare();
  if (!user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!search) {
    return Response.json({ teams: [], users: [] });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   TEAMS                                    */
  /* -------------------------------------------------------------------------- */

  if (type === "team") {
    const teams = await db.team.findMany({
      where: {
        name: {
          contains: search,
          mode: "insensitive",
        },
        members: {
          none: { userId: user.id }, // user not already a member
        },
      },
      select: {
        id: true,
        name: true,
      },
      take: 10,
    });

    return Response.json({ teams, users: [] });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   USERS                                    */
  /* -------------------------------------------------------------------------- */

  const users = await db.user.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              fullName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              username: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
        { id: { not: user.id } }, // exclude self
        {
          friendshipsInitiated: {
            none: { receiverId: user.id },
          },
        },
        {
          friendshipsReceived: {
            none: { initiatorId: user.id },
          },
        },
      ],
    },
    select: {
      id: true,
      username: true,
      fullName: true,
      avatar: true,
    },
    take: 10,
  });

  return Response.json({ teams: [], users });
}
