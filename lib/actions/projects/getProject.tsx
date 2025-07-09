// app/actions/getProjects.ts
"use server";

import {prisma} from "@/lib/db/prisma"
import { format } from "date-fns";
import { currentUser } from "@clerk/nextjs/server";

export async function getProjects({
  limit = 3,
  type = "recent", // 'recent' | 'public' | 'private' | 'genrated' | 'starred' | 'archived' | 'git import'
}: {
  limit?: number;
  type?: 'recent' | 'public' | 'private' | 'genrated' | 'starred' | 'archived' | 'git import';
}) {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      throw new Error("Unauthorized");
    }

    const email = user.emailAddresses[0].emailAddress;
    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    const where: any = {};
    if (type === "recent" && dbUser) {
      where.ownerId = dbUser.id;
    } else if (type === "public") {
      where.AND = [{ type: "PUBLIC" }, { ownerId: dbUser?.id }];
    } else if (type === "private") {
      where.AND = [{ type: "PRIVATE" }, { ownerId: dbUser?.id }];
    } else if (type === "genrated") {
      where.AND = [{ type: "GENERATED" }, { ownerId: dbUser?.id }];
    } else if (type === "archived" && dbUser) {
      where.AND = [{ ownerId: dbUser.id }, { archeivedBy: dbUser.id }];
    } else if (type === "git import" && dbUser) {
      where.AND = [{ ownerId: dbUser.id }, { isGitImport: true }];
    } else if (type === "starred") {
      where.starredBy = { some: { id: dbUser?.id } };
    } else {
      throw new Error("Invalid type");
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: type === "recent" ? { updatedAt: "desc" } : undefined,
      take: Number(limit) || 3,
      include: {
        starredBy: { where: { id: dbUser?.id } },
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatted = projects.map((proj :any) => ({
      id: proj.id,
      title: proj.name,
      type: proj.type,
      description: proj.description,
      framework: proj.packages,
      lastUpdated: format(proj.updatedAt, "yyyy-MM-dd"),
      isStarred: proj.starredBy.length === 1,
      isArchived: proj.archeivedBy ? true : false,
      gitImport: proj.isGitImport || false,
      collaborators: proj.team?.members.map((m:any) => ({
        fullName: m.user.fullName,
        avatar: m.user.avatar,
      })) || [],
    }));

    return formatted; // Return the formatted data directly
  } catch (error) {
    console.error("Error occurred at getting project", error);
    throw new Error("Server error");
  }
}