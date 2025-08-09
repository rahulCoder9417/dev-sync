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

const createSchema = z.object({
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
  type: z.enum(['file', 'folder'], {
    required_error: 'Type must be either "file" or "folder"'
  }),
  projectId: z.string().cuid('Invalid project ID'),
  parentId: z.string().cuid('Invalid parent ID').optional(),
})

export async function POST(request: NextRequest) {
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
    const validation = createSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {  error: 'Validation failed' + validation.error.format().type?._errors[0],},
        { status: 400 }
      )
    }

    const { name, type, projectId, parentId } = validation.data
    
    // Additional validation for file types
    if (type === 'file' && !FILE_NAME_PATTERNS.validExtensions.test(name)) {
      return NextResponse.json(
        { error: 'Invalid file extension' },
        { status: 400 }
      )
    }

    if (type === 'folder' && !FILE_NAME_PATTERNS.folder.test(name)) {
      return NextResponse.json(
        { error: 'Invalid folder name format' },
        { status: 400 }
      )
    }
    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        team: {
          members: {
            some: {
              userId: dbUser.id
            }
          }
        }
      },
      select: { id: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    // If parentId is provided, check if it exists and user has access
    if (parentId) {
      const parentItem = await prisma.fileItem.findFirst({
        where: {
          id: parentId,
        },
        select: { 
          id: true, 
          type: true,
          projectId: true
        }
      })

      if (!parentItem) {
        return NextResponse.json(
          { error: 'Parent folder not found or access denied' },
          { status: 404 }
        )
      }

      // Parent must be a folder
      if (parentItem.type !== 'folder') {
        return NextResponse.json(
          { error: 'Parent must be a folder stop hacking' },
          { status: 400 }
        )
      }

      // Parent must be in the same project
      if (parentItem.projectId !== projectId) {
        return NextResponse.json(
          { error: 'Parent folder must be in the same project' },
          { status: 400 }
        )
      }
    }
    // Check if item with same name already exists in the same location
    const existingItem = await prisma.fileItem.findFirst({
      where: {
        name,
        projectId,
        parentId: parentId || null
      }
    })

    if (existingItem) {
      return NextResponse.json(
        { error: `A ${type} with this name already exists in this location` },
        { status: 409 }
      )
    }
    // Create the file item
    const newFileItem = await prisma.fileItem.create({
      data: {
        name,
        type,
        content: "",
        projectId,
        parentId: parentId || null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        type: true,
        parentId: true,
      }
    })
    if(!newFileItem){
      return NextResponse.json({
        error: 'Failed to create file item'},
        { status: 500 }
      )
    }
    return NextResponse.json({
      success: true,
      message: `${type === 'file' ? 'File' : 'Folder'} created successfully`,
      data: {...newFileItem,children:[]},
      status:201
  })

  } catch (error) {
    console.error('Create file item API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
