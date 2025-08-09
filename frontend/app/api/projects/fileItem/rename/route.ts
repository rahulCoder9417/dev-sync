//create rename and delete

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/db/prisma'
import { z } from 'zod'

const FILE_NAME_PATTERNS = {
  basic: /^[a-zA-Z0-9._-]+$/,
  noLeadingTrailing: /^(?!\.)(?!.*\.$)(?!\s)(?!.*\s$).+$/,
  validExtensions: /\.(js|ts|jsx|tsx|html|css|scss|sass|less|json|md|txt|py|java|cpp|c|h|hpp|php|rb|go|rs|rust|swift|kt|dart|vue|svelte|xml|yml|yaml|toml|ini|cfg|conf|config|log|sql|sh|bash|zsh|bat|ps1|dockerfile|gitignore|gitattributes|env|sample|example|template|lock|min|map|woff|woff2|ttf|otf|eot|svg|png|jpg|jpeg|gif|webp|ico|pdf|zip|tar|gz|rar|7z|bak|tmp|cache|dist|build)$/i,
  // Folder name: no file extensions
  folder: /^[a-zA-Z0-9._/-]+$/,
  // Reserved names to avoid
  reserved: /^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i
}

const renameSchema = z.object({
  id: z.string().cuid('Invalid file item ID'),
  name: z.string()
    .min(1, 'Name cannot be empty')
    .max(255, 'Name too long (max 255 characters)')
    .refine(
      (name) => FILE_NAME_PATTERNS.noLeadingTrailing.test(name),
      'Name cannot start or end with dots or spaces'
    )
    .refine(
      (name) => !FILE_NAME_PATTERNS.reserved.test(name.split('.')[0]),
      'Name cannot be a reserved system name'
    ),
  type: z.enum(['file', 'folder']).optional()
})

export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const user = await currentUser()
    if (!user?.emailAddresses?.[0]?.emailAddress) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const email = user.emailAddresses[0].emailAddress

    // Get user from database
    const dbUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = renameSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed' + validation.error.format().type?._errors[0],
        },
        { status: 400 }
      )
    }

    let { id, name, type } = validation.data

    // Additional regex validation based on type
    if (type === 'folder') {
      if (!FILE_NAME_PATTERNS.folder.test(name)) {
        return NextResponse.json(
          { error: 'Folder names should be proper' },
          { status: 400 }
        )
      }
      if (name.includes('.')) {
        return NextResponse.json(
          { error: 'Folder names should not contain file extensions' },
          { status: 400 }
        )
      }
      name=name+"/"
    } else if (type=="file") {
      if (!FILE_NAME_PATTERNS.basic.test(name)) {
        return NextResponse.json(
          { error: 'File names should be proper' },
          { status: 400 }
        )
      }
      if (!FILE_NAME_PATTERNS.validExtensions.test(name)) {
        return NextResponse.json(
          { 
            error: 'File must have a valid extension'
          },
          { status: 400 }
        )
      }
    }

    // Check if file item exists and user has access
    const existingItem = await prisma.fileItem.findFirst({
      where: {
        id,
        project: {
          team: {
            members: {
              some: {
                userId: dbUser.id
              }
            }
          }
        }
      },
      include: {
        project: {
          select: { id: true }
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'File item not found or access denied' },
        { status: 404 }
      )
    }

    // Check for name conflicts in the same directory
    const siblingWithSameName = await prisma.fileItem.findFirst({
      where: {
        name,
        projectId: existingItem.projectId,
        parentId: existingItem.parentId,
        id: { not: id }
      }
    })

    if (siblingWithSameName) {
      return NextResponse.json(
        { error: 'A file or folder with this name already exists in the same location' },
        { status: 409 }
      )
    }

    // Update the file item
    const updatedItem = await prisma.fileItem.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json({
      status: 200,
      data: updatedItem,
      success: 'File renamed successfully'
    })

  } catch (error) {
    console.error('Rename API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
