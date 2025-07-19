'use server'

import db from "@/lib/db/prisma"
import prisma from '@/lib/db/prisma'
import { currentUser } from '@clerk/nextjs/server'


interface CreateProjectInput {
  name: string;
  description?: string;
  type: "PUBLIC" | "PRIVATE" | "GENRATED";
  packages: string;
}

export async function createFileItem(data: {
  name: string
  type: 'FOLDER' | 'FILE' | 'IMAGE' | 'SVG'
  projectId: string
  parentId?: string | null
}) {

  const { name, type, projectId, parentId } = data

  const fileItem = await prisma.fileItem.create({
    data: {
      name,
      type,
      projectId,
      parentId: parentId ?? null,
    },
  })

  return fileItem
}




export async function createProjectWithTeam(input: CreateProjectInput) {
  const user = await currentUser();

  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error("Unauthorized");
  }

  const email = user.emailAddresses[0].emailAddress;

  const dbUser = await db.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  // 1. Create a new team with a generated name (can be renamed later)
  const team = await db.team.create({
    data: {
      name: `${input.name} Team`,
      type: "PRIVATE", // default to PRIVATE
      members: {
        create: {
          userId: dbUser.id,
          role: "ADMIN", // Owner becomes ADMIN
        },
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