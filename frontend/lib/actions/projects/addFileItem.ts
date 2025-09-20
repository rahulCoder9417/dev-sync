'use server'

import prisma from '@/lib/db/prisma'
import { z } from 'zod'

const createFileItemSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['folder', 'file']),
  content: z.string(),
  projectId: z.string().cuid(),
  parentId: z.string().cuid().optional().nullable(), // if root level
})

export async function createFileItem(data: {
  name: string
  type: "folder" | "file"
  content:  string
  projectId: string
  parentId?: string | null
}) {
  const validated = createFileItemSchema.safeParse(data)

  if (!validated.success) {
    throw new Error('Invalid input: ' + JSON.stringify(validated.error.format()))
  }

  const { name, type, projectId,content, parentId } = validated.data

  const fileItem = await prisma.fileItem.create({
    data: {
      name,
      content,
      type,
      projectId,
      parentId: parentId ?? null,
    },
  })

  return fileItem
}
