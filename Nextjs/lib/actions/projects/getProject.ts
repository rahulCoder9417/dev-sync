// app/actions/getProjects.ts
"use server";

import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
import { Project } from "@/lib/types/projects";
import { FileNode, FileNodeWithChildren } from "@/lib/types/types";
function formatDate(date: Date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getProjects({
  limit,
  type = "recent", // 'recent' | 'public' | 'private' | 'genrated' | 'starred' | 'archived' | 'git import'
}: {
  limit?: number;
  type?:
    | "recent"
    | "public"
    | "private"
    | "genrated"
    | "starred"
    | "archived"
    | "git import";
}) {
  try {
    const dbUser = await middleWare();
    if (!dbUser) throw new Error("Unauthorized");

    const where: any = {};
    if (type === "recent") {
      where.team = {
        members: {
          some: {
            userId: dbUser.id,
          },
        },
      };
    } else if (type === "public") {
      where.AND = [{ type: "PUBLIC" }, { ownerId: dbUser.id }];
    } else if (type === "private") {
      where.AND = [{ type: "PRIVATE" }, { ownerId: dbUser.id }];
    } else if (type === "genrated") {
      where.AND = [{ type: "GENERATED" }, { ownerId: dbUser.id }];
    } else if (type === "archived") {
      where.AND = [
        { ownerId: dbUser.id },
        { archiveprojectBy: { some: { id: dbUser.id } } },
      ];
    } else if (type === "git import") {
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
        archiveprojectBy: true,
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    avatar: true,
                    username: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatted: Project[] = projects.map((proj) => ({
      id: proj.id,
      title: proj.name,
      type: proj.type,
      description: proj.description,
      framework: proj.packages,
      lastUpdated: formatDate(proj.updatedAt),
      isStarred: proj.starredBy.some((u) => u.id === dbUser.id),
      isArchived: proj.archiveprojectBy.some((u) => u.id === dbUser.id),
      isGitImport: proj.isGitImport || false,
      collaborators:
        proj.team?.members.map((m) => ({
          fullName: m.user.fullName,
          avatar: m.user.avatar,
          username: m.user.username,
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
    const dbUser = await middleWare();
    if (!dbUser) throw new Error("Unauthorized");

    const project = await db.project.findUnique({
      where: { id },
      include: {
        starredBy: true,
        archiveprojectBy: true,
        team: {
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
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
    const isStarred = project.starredBy.some((u) => u.id === dbUser.id);
    const isArchived = project.archiveprojectBy.some((u) => u.id === dbUser.id);
    const totalStars = project.starredBy.length;

    return {
      id: project.id,
      title: project.name,
      description: project.description,
      framework: project.packages,
      type: project.type,
      createdAt: formatDate(project.createdAt),
      gitRepo: project.gitRepo,
      ownerId: project.ownerId,
      gitImport: project.isGitImport,
      updatedAt: formatDate(project.updatedAt),
      isStarred,
      stars: project.starredBy.length,
      isOwner,
      isArchived,
      totalStars,
      team:
        project.team?.members.map((m) => ({
          fullName: m.user.fullName,
          avatar: m.user.avatar,
          id: m.user.id,
        })) || [],
    };
  } catch (error) {
    console.error("Error in getSingleProject:", error);
    throw new Error("Failed to fetch project");
  }
};

export const getProjectById = async (projectId: string) => {
  try {
    const dbUser = await middleWare();
    if (!dbUser) throw new Error("Unauthorized");

    if (!projectId || typeof projectId !== "string") {
      return { error: "rojectId IS wrong", status: 400 };
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
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    username: true,
                    avatar: true,
                  },
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
          },
        },
      },
    });

    if (!project) {
      return { error: "Project not Found", status: 404 };
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
            map.get(file.id).type === "folder"
              ? parent.children.unshift(map.get(file.id))
              : parent.children.push(map.get(file.id));
          }
        } else {
          if (file.type === "folder") {
            folderRoots.push(map.get(file.id));
          } else {
            roots.push(map.get(file.id));
          }
        }
      }
      return [...folderRoots, ...roots];
    }

    const buildFile = (files: any[]) => {
      const map: Record<string, FileNodeWithChildren> = {};
      const fileRoots: FileNodeWithChildren[] = [];
      const folderRoots: FileNodeWithChildren[] = [];
      for (const file of files) {
        let childs: Record<string, string[]> = {};
        if (file.type === "folder") {
          childs["fileChildren"] = [];
          childs["folderChildren"] = [];
        }
        childs["ancestorsId"] = [];
        map[file.id] = { ...file, ...childs };
      }
      for (const file of files) {
        if (file.parentId) {
          const parent = map[file.parentId];
          if (parent) {
            file.type === "folder"
              ? parent.folderChildren.push(file.id)
              : parent.fileChildren.push(file.id);
          }
        } else {
          if (file.type === "folder") {
            folderRoots.push(map[file.id]);
          } else {
            fileRoots.push(map[file.id]);
          }
        }
      }
      const computeAncestors = (
        node: FileNodeWithChildren,
        parentAncestors: string[],
      ) => {
        node.ancestorIds = parentAncestors;

        const nextAncestors = [...parentAncestors, node.id];

        for (const childId of node.folderChildren) {
          computeAncestors(map[childId], nextAncestors);
        }

        for (const childId of node.fileChildren) {
          computeAncestors(map[childId], nextAncestors);
        }
      };

      // Run for all roots
      for (const root of folderRoots) {
        computeAncestors(root, []);
      }

      for (const root of fileRoots) {
        computeAncestors(root, []);
      }
      return { fileRoots, folderRoots, map };
    };
    const responseData = {
      id: project.id,
      name: project.name,
      userId: dbUser.id,
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
      ...buildFile(project.files),
    };

    return { responseData, status: 200 };
  } catch (error: any) {
    return { error: "Something went wrong", status: 500 };
  }
};
