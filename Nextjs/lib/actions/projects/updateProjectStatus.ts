"use server";

import db from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

type UpdateAction = "star" | "archive" | "toggleType" | "name";

export const updateProjectStatus = async ({
  projectId,
  action,
  name,
  description,
}: {
  projectId: string;
  action: UpdateAction;
  name?:string;
  description?:string | null;
}) => {
  try {
   const dbUser = await middleWare()
   if(!dbUser) throw new Error("Unauthorized")

    const project = await db.project.findUnique({
      where: { id: projectId },
      include: { starredBy: true,
        archiveprojectBy: true ,
        team:{
          select:{
            members:{
              select:{
                userId:true,
              }
            }
          }
        }
      },
    });

    if (!project) {
      throw new Error("Project not found");
    }

    const isOwner = project.ownerId === dbUser.id;
    const isMember = project.team?.members.some((m) => m.userId === dbUser.id);

    switch (action) {
      case "star": {
        const isStarred = project.starredBy.some(u => u.id === dbUser.id);

        await db.project.update({
          where: { id: projectId },
          data: {
            starredBy: {
              [isStarred ? "disconnect" : "connect"]: { id: dbUser.id },
            },
          
          },
        });

        return {
          success: true,
          type: "star",
          starred: !isStarred,
        };
      }

      case "archive": {
        if (!(isOwner || isMember)) {
          throw new Error("Only team member can archive/unarchive");
        }

        const isArchived = project.archiveprojectBy.some((u) => u.id === dbUser.id);

        await db.project.update({
          where: { id: projectId },
          data: {
            archiveprojectBy: isArchived ? {disconnect:{id:dbUser.id}} : {connect:{id:dbUser.id}},
          },
        });

        return {
          success: true,
          type: "archive",
          archived: !isArchived,
        };
      }

      case "toggleType": {
        if (!isOwner) {
          throw new Error("Only owner can change project type");
        }

        const newType= project.type === "PUBLIC" ? "PRIVATE" : "PUBLIC";

        await db.project.update({
          where: { id: projectId },
          data: {
            type: newType,
            name:name,
            description,
          },
        });

        return {
          success: true,
          type: "toggleType",
          newType,
        };
      }
      case "name": {
        if (!isOwner) {
          throw new Error("Only owner can change project type");
        }

        await db.project.update({
          where: { id: projectId },
          data: {
            name:name,
            description,
          },
        });

        return {
          success: true,
          type: "name",
        };
      }

      default:
        throw new Error("Invalid action");
    }
  } catch (error) {
    console.error("Error updating project status:", error);
    throw new Error("Failed to update project status");
  }
};
