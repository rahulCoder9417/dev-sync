'use server';
import db from "@/lib/db/prisma"
import { currentUser } from '@clerk/nextjs/server';

export async function FetchTeam(projectId: string) {
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error('Unauthorized');
  }

  const email = user.emailAddresses[0].emailAddress;

  const dbUser = await db.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    select: {
      team: {
        select: {
          members: {
            select: {
              userId:true,
              role:true,
              user: {
                select: {
                  fullName: true,
                  avatar: true,
                },
              },
            },
          },
          pendingRequests: {
            select: {
              userId:true,
              status:true,
              user: {
                select: {
                  fullName: true,
                  avatar: true,
                },
              },
            },
          },
          bannedUsers: {
            select: {
              userId:true,
              reason:true,
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
  });

  if (!project || !project.team) {
    throw new Error('Project or team not found');
  }

  return {
    status: true,
    team: project.team,
  };
}

export async function joinTeam(projectId: string) {
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error('Unauthorized');
  }

  const email = user.emailAddresses[0].emailAddress;

  const dbUser = await db.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      team: {
        include: {
          members: {
            select: {
              userId: true,
            }
          },
          pendingRequests: {
            select: {
              userId: true,
              status: true
            }
          },
          bannedUsers: {
            select: {
              userId: true,
            }
          },
        },
      },
    },
  });
  if (!project || !project.team) {
    throw new Error('Project or team not found');
  }
  const team = project.team;

  // Check ban list
  const isBanned = team.bannedUsers.some((ban) => ban.userId === dbUser.id);
  if (isBanned) {

    return {
      status: false,
      message: "You are banned from this team",
    };
  }


  // Check if already a member
  const member = team.members.find((m) => m.userId === dbUser.id);
  if (member) {
    const res = await db.teamMember.delete({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: dbUser.id,
        }
      }
    });
    if (!res) {
      throw new Error(`[joinTeam] Failed to remove member`);
    }
    await db.teamRequest.delete({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: dbUser.id,
        }
      }
    });



    return {
      status: true,
      message: "You Are removed"
    };
  }

  // Check if already requested
  const alreadyRequested = team.pendingRequests.find(
    (r) => r.userId === dbUser.id
  );

  if (!alreadyRequested) {
    await db.teamRequest.create({
      data: {
        teamId: team.id,
        userId: dbUser.id,
        status: 'pending',
      },
    });
  }
  if (alreadyRequested?.status === "rejected") {
    await db.teamRequest.update({
      where: {
        teamId_userId: {
          teamId: team.id,
          userId: dbUser.id,
        }
      },
      data: {
        status: 'pending',
      },
    })
  }

  return {
    status: true,
    message: 'Request to join the team is pending approval',
  };
}

export async function manageProjectTeamMember({
  projectId,
  targetUserId,
  action, // "approve" | "revoke" | "ban"
  reason = '',
}: {
  projectId: string;
  targetUserId: string;
  action: 'approve' | 'revoke' | 'ban';
  reason?: string;
}) {
  const user = await currentUser();
  if (!user?.emailAddresses?.[0]?.emailAddress) {
    throw new Error('Unauthorized');
  }

  const email = user.emailAddresses[0].emailAddress;

  const dbUser = await db.user.findUnique({
    where: { email },
  });

  if (!dbUser) {
    throw new Error('User not found');
  }

  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      team: true,
    },
  });

  if (!project) {
    throw new Error('Project not found');
  }

  if (project.ownerId !== dbUser.id) {
    throw new Error('Only the project owner can perform this action');
  }

  const team = project.team;
  if (!team) {
    throw new Error('Project does not belong to a team');
  }

  switch (action) {
    case 'approve':
      // Accept request if it exists
      await db.teamRequest.updateMany({
        where: {
          teamId: team.id,
          userId: targetUserId,
          status: 'pending',
        },
        data: { status: 'accepted' },
      });
      await db.teamBan.deleteMany({
        where: {
          teamId: team.id,
          userId: targetUserId,
        },
      });
      

      // Add as team member
      await db.teamMember.upsert({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: targetUserId,
          },
        },
        create: {
          teamId: team.id,
          userId: targetUserId,
          role: 'MEMBER',
        },
        update: {},
      });
      break;

    case 'revoke':
      // Remove team member
      await db.teamMember.deleteMany({
        where: {
          teamId: team.id,
          userId: targetUserId,
        },
      });

      // Optionally update teamRequest status to "rejected"
      await db.teamRequest.updateMany({
        where: {
          teamId: team.id,
          userId: targetUserId,
        },
        data: {
          status: 'rejected',
        },
      });
      break;

    case 'ban':
      // Ban the user
      await db.teamBan.upsert({
        where: {
          teamId_userId: {
            teamId: team.id,
            userId: targetUserId,
          },
        },
        create: {
          teamId: team.id,
          userId: targetUserId,
          reason,
        },
        update: {
          reason,
        },
      });

      // Revoke if user is a member
      await db.teamMember.deleteMany({
        where: {
          teamId: team.id,
          userId: targetUserId,
        },
      });

      // Reject any pending requests
      await db.teamRequest.deleteMany({
        where: {
          teamId: team.id,
          userId: targetUserId,
        }
      });

      break;

    default:
      throw new Error('Invalid action');
  }

  return { success: true };
}
