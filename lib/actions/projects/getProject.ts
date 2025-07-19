// app/actions/getProjects.ts
"use server";

import db from "@/lib/db/prisma"
import { format } from "date-fns";
import { currentUser } from "@clerk/nextjs/server";

export async function getProjects({
  limit ,
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
    const dbUser = await db.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    const where: any = {};
    if (type === "recent" ) {
      where.ownerId = dbUser.id;
    } else if (type === "public") {
      where.AND = [{ type: "PUBLIC" }, { ownerId: dbUser.id }];
    } else if (type === "private") {
      where.AND = [{ type: "PRIVATE" }, { ownerId: dbUser.id }];
    } else if (type === "genrated") {
      where.AND = [{ type: "GENERATED" }, { ownerId: dbUser.id }];
    } else if (type === "archived" ) {
      where.AND = [{ ownerId: dbUser.id }, { archeivedBy: dbUser.id }];
    } else if (type === "git import" ) {
      where.AND = [{ ownerId: dbUser.id }, { isGitImport: true }];
    } else if (type === "starred") {
      where.starredBy = { some: { id: dbUser?.id } };
    } else {
      throw new Error("Invalid type");
    }

    const projects = await db.project.findMany({
      where,
      orderBy: type === "recent" ? { updatedAt: "desc" } : undefined,
      take: Number(limit) || undefined,
      include: {
        starredBy: true,
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

    const formatted = projects.map((proj) => ({
      id: proj.id,
      title: proj.name,
      type: proj.type,
      description: proj.description,
      framework: proj.packages,
      lastUpdated: format(proj.updatedAt, "yyyy-MM-dd"),
      isStarred: proj.starredBy.some(u => u.id === dbUser.id),
      isArchived: proj.archeivedBy ? true : false,
      gitImport: proj.isGitImport || false,
      collaborators: proj.team?.members.map((m) => ({
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


export const getSingleProject = async (id: string) => {
  try {
    const user = await currentUser();
    if (!user || !user.emailAddresses?.[0]?.emailAddress) {
      throw new Error("Unauthorized");
    }

    const email = user.emailAddresses[0].emailAddress;

    const dbUser = await db.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      throw new Error("User not found");
    }

    const project = await db.project.findUnique({
      where: { id },
      include: {
        starredBy: true,
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id:true,
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

    if (!project) throw new Error("Project not found");

    const isOwner = project.ownerId === dbUser.id;
    const isStarred = project.starredBy.some(u => u.id === dbUser.id);
    const isArchived = project.archeivedBy === dbUser.id;
    const totalStars = project.starredBy.length;

    return {
      id: project.id,
      title: project.name,
      description: project.description,
      framework: project.packages,
      type: project.type,
      createdAt:format(project.createdAt, "yyyy-MM-dd"),
      gitRepo:project.gitRepo,
      ownerId:project.ownerId,
      gitImport: project.isGitImport,
      updatedAt: format(project.updatedAt, "yyyy-MM-dd"),
      isStarred,
      stars:project.starredBy.length,
      isOwner,
      isArchived,
      totalStars,
      team: project.team?.members.map(m => ({
        fullName: m.user.fullName,
        avatar: m.user.avatar,
        id:m.user.id
      })) || [],
    };
  } catch (error) {
    console.error("Error in getSingleProject:", error);
    throw new Error("Failed to fetch project");
  }
};
