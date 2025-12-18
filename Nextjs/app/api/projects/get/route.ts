import db from "@/lib/db/prisma";
import { format } from "date-fns";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { limit, type } = await req.json();

    const user = await currentUser();
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = user.emailAddresses[0].emailAddress;
    const dbUser = await db.user.findUnique({ where: { email } });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const where: any = {};
    if (type === "recent") {
      where.ownerId = dbUser.id;
    } else if (type === "public") {
      where.AND = [{ type: "PUBLIC" }, { ownerId: dbUser.id }];
    } else if (type === "private") {
      where.AND = [{ type: "PRIVATE" }, { ownerId: dbUser.id }];
    } else if (type === "generated") {
      where.AND = [{ type: "GENERATED" }, { ownerId: dbUser.id }];
    } else if (type === "archived") {
      where.AND =[
        { ownerId: dbUser.id },
        { archiveprojectBy: { some: { id: dbUser.id } } }
      ];
    } else if (type === "git import") {
      where.AND = [{ ownerId: dbUser.id }, { isGitImport: true }];
    } else if (type === "starred") {
      where.starredBy = { some: { id: dbUser?.id } };
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const projects = await db.project.findMany({
      where,
      orderBy: type === "recent" ? { updatedAt: "desc" } : undefined,
      take: Number(limit) || undefined,
      include: {
        starredBy: true,
        archiveprojectBy: true,
        team: {
          include: {
            members: {
              include: {
                user: { select: { fullName: true, avatar: true } },
              },
            },
          },
        },
      },
    });

    const formatted = projects.map((proj) => ({
      id: proj.id,
      title: proj.name,
      type: proj.type,
      description: proj.description,
      framework: proj.packages,
      lastUpdated: format(proj.updatedAt, "yyyy-MM-dd"),
      isStarred: proj.starredBy.some((u) => u.id === dbUser.id),
      isArchived: proj.archiveprojectBy.some((u) => u.id === dbUser.id),
      gitImport: proj.isGitImport || false,
      collaborators:
        proj.team?.members.map((m) => ({
          fullName: m.user.fullName,
          avatar: m.user.avatar,
        })) || [],
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Error occurred at getting project", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
