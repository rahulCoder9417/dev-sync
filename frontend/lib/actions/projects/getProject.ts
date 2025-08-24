// app/actions/getProjects.ts
"use server";

import db from "@/lib/db/prisma"
import { format } from "date-fns";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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


export const getProjectById = async (projectId: string) => {
  try {
    const user = await currentUser();

    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return { error: "Unauthrized You dont exist" ,  status: 401 };
    }

    const email = user.emailAddresses[0].emailAddress;

    const dbUser = await db.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!dbUser) {
      return { error: "Unauthrized You dont exist" ,  status: 401 };
    }


    if (!projectId || typeof projectId !== "string") {
      return { error: "rojectId IS wrong" ,  status: 400 };
      
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        type: true,
        isGitImport: true,
        ownerId: true,
        team: {
          select: {
            id: true,
            name: true,
            members: {
              select: {
                userId: true,
                user:{
                    select:{
                        id:true,
                        fullName:true,
                        username:true,
                        avatar:true
                    }
                },
                role: true,
              },
            },
          },
        },
        files: {
          select: {
            id: true,
            name: true,
            type: true,
            content: true,
            parentId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!project) {
      return { error: "Project not Found" ,  status: 404 };
    }

    const isOwner = project.ownerId === dbUser.id;

    const teamMembers = project.team?.members ?? [];
    const isTeamMember = teamMembers.some((m) => m.userId === dbUser.id);
    
    
    
    function buildFileTree(files: any[]) {
        const map = new Map<string, any>();
        const roots: any[] = [];
      const folderRoots: any[] = [];
        for (const file of files) {
          map.set(file.id, { ...file, children: [] });
        }
      
        for (const file of files) {
          if (file.parentId) {
            const parent = map.get(file.parentId);
            if (parent) {
              map.get(file.id).type==="folder"?
              parent.children.unshift(map.get(file.id)):
              parent.children.push(map.get(file.id))
            }
          } else {
            if(file.type==="folder"){
              folderRoots.push(map.get(file.id));
            }else{
              roots.push(map.get(file.id));
            }
          }
        }
      
        return [...folderRoots,...roots];
      }
      
    const responseData = {
      id:project.id,
      name: project.name,
      userId:dbUser.id,
      type: project.type,
      isGitImport: project.isGitImport,
      isOwner,
      isTeamMember,
      team: {
        id: project.team?.id,
        name: project.team?.name,
        members: teamMembers,
      },
      files: buildFileTree(project.files),
      
    };

    return {responseData,  status: 200 };
  } catch (error:any) {
    return { error: "Something went wrong" ,  status: 500 };
  }
}

