'use server'

import db from "@/lib/db/prisma"
import { currentUser } from "@clerk/nextjs/server"

export async function getUserProjectStats() {
  const user = await currentUser()
  if (!user || !user.emailAddresses?.[0]?.emailAddress) return null

  const dbUser = await db.user.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
    include: {
      starredProjects: true,
      archieveProjects: true,
      appsGenerated: true,
      projects: true,
    },
  })

  if (!dbUser) return null

  return {
    fullName: dbUser.fullName,
    starred: dbUser.starredProjects.length,
    archeive: dbUser.archieveProjects.length,
    generated: dbUser.appsGenerated.length,
    owned: dbUser.projects.length,
  }
}
