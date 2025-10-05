'use server'

import db from "@/lib/db/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function getUserProjectStats() {
  const user = await currentUser()
  if (!user || !user.emailAddresses?.[0]?.emailAddress) return null

  const dbUser = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    select: {
      fullName: true,
      _count: {
        select: {
          starredProjects: true,
          archieveProjects: true,
          appsGenerated: true,
          projects: true,
        }
      }
    }
  })

  if (!dbUser) return null

  return {
    fullName: dbUser.fullName,
    starred: dbUser._count.starredProjects,
    archeive: dbUser._count.archieveProjects,
    generated: dbUser._count.appsGenerated,
    owned: dbUser._count.projects,
  }
}
