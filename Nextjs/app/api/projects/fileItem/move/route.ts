import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { z } from "zod";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

const moveSchema = z.object({
  moveId: z.string(),
  moveToId: z.string().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    const dbUser = await middleWare();
    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validation = moveSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { moveId, moveToId } = validation.data;

    const nodeToMove = await prisma.fileItem.findUnique({
      where: { id: moveId },
      include: { project: true },
    });

    if (!nodeToMove) {
      return NextResponse.json(
        { error: "File node not found" },
        { status: 404 }
      );
    }

    // Prevent moving into itself
    if (moveId === moveToId) {
      return NextResponse.json(
        { error: "Cannot move into itself" },
        { status: 400 }
      );
    }

    // If moving inside a folder, validate target
    if (moveToId) {
      const newParent = await prisma.fileItem.findUnique({
        where: { id: moveToId },
      });

      if (!newParent) {
        return NextResponse.json(
          { error: "Target folder not found" },
          { status: 404 }
        );
      }

      if (newParent.projectId !== nodeToMove.projectId) {
        return NextResponse.json(
          { error: "Cross-project move not allowed" },
          { status: 400 }
        );
      }

      if (newParent.type !== "folder") {
        return NextResponse.json(
          { error: "Target must be folder" },
          { status: 400 }
        );
      }

      //  Prevent moving into its own descendant
      const isDescendant = await checkIfDescendant(
        moveId,
        moveToId
      );

      if (isDescendant) {
        return NextResponse.json(
          { error: "Cannot move into its descendant" },
          { status: 400 }
        );
      }
    }

    await prisma.fileItem.update({
      where: { id: moveId },
      data: {
        parentId: moveToId,
      },
    });

    return NextResponse.json({ success: true },{status:200});

  } catch (error) {
    console.error("Move API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
async function checkIfDescendant(
  moveId: string,
  targetId: string
): Promise<boolean> {
  let current = await prisma.fileItem.findUnique({
    where: { id: targetId },
  });

  while (current?.parentId) {
    if (current.parentId === moveId) {
      return true;
    }

    current = await prisma.fileItem.findUnique({
      where: { id: current.parentId },
    });
  }

  return false;
}