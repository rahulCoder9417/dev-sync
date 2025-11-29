import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import prisma from '@/lib/db/prisma'
import { z } from 'zod'

const deleteSchema = z.object({
  id: z.string().cuid('Invalid file item ID')
})

export async function DELETE(request: NextRequest) {
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
    const validation = deleteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Validation failed' + validation.error.format()._errors[0]
        },
        { status: 400 }
      )
    }

    const { id } = validation.data

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
        id:true,
        type:true,
        parentId:true,
        project: {
          select: { id: true }
        }
      },    })

    if (!existingItem) {
      return NextResponse.json(
        { error: 'File item not found or access denied' },
        { status: 404 }
      )
    }

    // Recursive function to delete all children
    async function deleteItemAndChildren(itemId: string): Promise<void> {
      // Get all children of this item
      const children = await prisma.fileItem.findMany({
        where: { parentId: itemId },
        select: { id: true }
      })

      // Recursively delete all children first
      for (const child of children) {
        await deleteItemAndChildren(child.id)
      }

      // Delete the item itself
      await prisma.fileItem.delete({
        where: { id: itemId }
      })
    }

    if(existingItem.type==="file"){
      const res = await prisma.fileItem.deleteMany({
        where: { id: id }
      })
      if(!res){
        return NextResponse.json(
          { error: 'File item cant be deleted' },
          { status: 404 }
        )
      }
    }else{
    // Start the recursive deletion
    await deleteItemAndChildren(id)
    }
    return NextResponse.json({
      success: true,
      status:200,
      message: 'File item deleted successfully',
    })

  } catch (error) {
    console.error('Delete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


