const { PrismaClient } = require('../lib/generated/prisma')
const prisma = new PrismaClient()

const usersData = [
  { username: 'aaa', email: '1@1.com', password: '1' },
  { username: 'bbb', email: '2@2.com', password: '2' },
  { username: 'ccc', email: '3@3.com', password: '3' },
  { username: 'ddd', email: '4@4.com', password: '4' },
  { username: 'eee', email: '5@5.com', password: '5' },
]

async function main() {
  console.log(`🌱 Seeding users...`)
  const users = await Promise.all(
    usersData.map((data, i) =>
      prisma.user.create({
        data: {
          fullName: `User ${i + 1}`,
          username: data.username,
          email: data.email,
          password: data.password
        },
      })
    )
  )

  console.log(`🌱 Seeding teams...`)
  for (let i = 0; i < 2; i++) {
    const team = await prisma.team.create({
      data: {
        name: `Team ${i + 1}`,
        type: i % 2 === 0 ? 'PUBLIC' : 'PRIVATE',
        members: {
          create: users.map((user, j) => ({
            user: { connect: { id: user.id } },
            role: j === 0 ? 'ADMIN' : 'MEMBER',
          })),
        },
      },
    })

    console.log(`🌱 Created ${team.name}`)
  }

  console.log(`🌱 Seeding projects and files...`)
  for (let i = 0; i < 5; i++) {
    const user = users[i % users.length]
    const project = await prisma.project.create({
      data: {
        name: `Project ${i + 1}`,
        description: `Auto-generated project ${i + 1}`,
        language: 'TypeScript',
        packages: ['next', 'react'],
        type: i % 2 === 0 ? 'PUBLIC' : 'PRIVATE',
        owner: { connect: { id: user.id } },
        activeprojectBy: { connect: { id: user.id } },
        starredBy: {
          connect: users
            .filter((u) => u.id !== user.id)
            .slice(0, 2)
            .map((u) => ({ id: u.id })),
        },
      },
    })

    // Create a root folder
    const rootFolder = await prisma.fileItem.create({
      data: {
        name: 'src',
        type: 'FOLDER',
        projectId: project.id,
      },
    })

    // Create files inside the root folder
    const fileTypes = ['FILE', 'IMAGE', 'SVG']
    for (let j = 0; j < 3; j++) {
      await prisma.fileItem.create({
        data: {
          name: `file-${j + 1}.${fileTypes[j].toLowerCase()}`,
          type: fileTypes[j],
          projectId: project.id,
          parentId: rootFolder.id,
        },
      })
    }
  }

  console.log(`🌱 Seeding friendships...`)
  for (let i = 0; i < users.length; i++) {
    for (let j = i + 1; j < users.length; j++) {
      await prisma.friendship.create({
        data: {
          initiator: { connect: { id: users[i].id } },
          receiver: { connect: { id: users[j].id } },
          status: Math.random() > 0.5 ? 'accepted' : 'pending',
        },
      })
    }
  }

  console.log(`✅ Seed complete.`)
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
