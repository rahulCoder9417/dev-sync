'use server'

import db from "@/lib/db/prisma"
import prisma from '@/lib/db/prisma'
import { TeamRole } from "@/lib/generated/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";
import { currentUser } from '@clerk/nextjs/server'


export interface CreateProjectInput {
  name: string;
  description?: string;
  type: "PUBLIC" | "PRIVATE" | "GENRATED";
  packages: string;
  members:Record<"userId",string>[]
}

export async function createFileItem(data: {
  name: string
  content: string
  type: 'FOLDER' | 'FILE' | 'IMAGE' | 'SVG'
  projectId: string
  parentId?: string | null
}) {

  const { name, type, projectId, parentId ,content} = data

  const fileItem = await prisma.fileItem.create({
    data: {
      content,
      name,
      type,
      projectId,
      parentId: parentId ?? null,
    },
  })

  return fileItem
}




export async function createProjectWithTeam(input: CreateProjectInput) {
     const dbUser = await middleWare()
     if(!dbUser) throw new Error("Unauthorized")
 
  const m = Object.keys(input.members).length !==0 ?[...input.members.map((i)=>({userId:i.userId,role:"MEMBER"as TeamRole}))] : []
  
  // 1. Create a new team with a generated name (can be renamed later)
  const team = await db.team.create({
    data: {
      name: `${input.name} Team`,
      type: "PRIVATE", // default to PRIVATE
      members: {
        create: [{
          
          userId: dbUser.id,
          role: "ADMIN", // Owner becomes ADMIN
        },
      ...m
    ],
      },
    },
  });

  // 2. Create the project and assign team + owner
  const project = await db.project.create({
    data: {
      name: input.name,
      description: input.description || "",
      type: input.type,
      packages: input.packages,
      ownerId: dbUser.id,
      teamId: team.id,
    },
  });

  return {
    success: true,
    projectId: project.id,
    teamId: team.id,
  };
}