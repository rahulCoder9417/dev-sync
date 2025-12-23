import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/db/prisma'
import { z } from 'zod'

const updateContentSchema = z.object({
  id: z.string().cuid('Invalid file item ID'),
  content: z.string()
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
    const validation = updateContentSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed' + validation.error.format().content?._errors[0] },
        { status: 400 }
      )
    }

    const { id, content } = validation.data
    console.log(id,content)
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
      select: {
        id: true,
        type: true,
        name: true,
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

    // Only files can have content updated
    if (existingItem.type !== 'file') {
      return NextResponse.json(
        { error: 'Only files can have content updated' },
        { status: 400 }
      )
    }

    // Update the file content
    const updatedFileItem = await prisma.fileItem.update({
      where: { id },
      data: {
        content,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        type: true,
        content: true,
        updatedAt: true
      }
    })

    if (!updatedFileItem) {
      return NextResponse.json(
        { error: 'Failed to update file content' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File content updated successfully',
      status: 200
    })

  } catch (error) {
    console.error('Update content API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}