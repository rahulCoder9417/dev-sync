import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { middleWare } from "@/lib/mainUtils/beckendMiddleWare";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;


  const dbUSer = await middleWare()
  if (!username) {
    return NextResponse.json({ success: false, error: "No identifier provided" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        bio: true,
        avatar: true,
        projects: {
          select: {
            id: true,
            name: true,
            description: true,
            packages: true,
            updatedAt: true,
            type: true,
            isGitImport: true,
            team: {
              select: {
                members: {
                  select: {
                    user: {
                      select: {
                        fullName: true,
                        avatar: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" });
    }

    const projects = user.projects.map((project) => ({
      id: project.id,
      title: project.name,
      description: project.description,
      framework: project.packages || "unknown",
      lastUpdated: project.updatedAt.toISOString(),
      type: project.type,
      isGitImport: project.isGitImport,
      collaborators:
        project.team?.members.map((m) => ({
          fullName: m.user.fullName,
          avatar: m.user.avatar,
        })) || [],
    }));

    const isFriend = await prisma.friendship.findFirst({
      where: {
        initiatorId: dbUSer?.id,
        receiverId: user.id,
      },
      select: {
        status: true,
      },
    });
    const transformedUser = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      projects,
      isFriend: isFriend?.status || "none",
    };

    return NextResponse.json({ success: true, user: transformedUser });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Server error" });
  }
}
