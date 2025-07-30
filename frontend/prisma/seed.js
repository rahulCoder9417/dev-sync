const { PrismaClient } = require('../lib/generated/prisma')
const prisma = new PrismaClient();

async function main() {
  // 1. USERS
  const users = await Promise.all(
    Array.from({ length: 5 }).map((_, i) =>
      prisma.user.create({
        data: {
          fullName: `User ${i + 1}`,
          email: `${i + 1}@${i + 1}.com`,
          username: `user${i + 1}`,
        },
      })
    )
  );

  // 2. FRIENDSHIPS (accepted between 1<->2, 3<->4, 2<->3)
  await prisma.friendship.createMany({
    data: [
      { initiatorId: users[0].id, receiverId: users[1].id, status: 'accepted' },
      { initiatorId: users[2].id, receiverId: users[3].id, status: 'accepted' },
      { initiatorId: users[1].id, receiverId: users[2].id, status: 'accepted' },
    ],
  });

  // 3. TEAM (Only for User 1)
  const team = await prisma.team.create({
    data: {
      name: 'Alpha Team',
      type: 'PUBLIC',
      members: {
        create: [
          {
            userId: users[0].id,
            role: 'ADMIN',
          },
        ],
      },
    },
    include: { members: true },
  });

  // 4. PROJECTS
  const projectData = [
    {
      name: 'Awesome Project',
      description: 'A React + TS project',
      packages: 'typescript react',
      type: 'PUBLIC',
      ownerId: users[0].id,
      teamId: team.id,
    },
    {
      name: 'Next.js App',
      description: 'SSR with Next.js',
      packages: 'nextjs',
      type: 'PRIVATE',
      ownerId: users[1].id,
      teamId: team.id,
    },
    {
      name: 'Node API',
      description: 'Express server',
      packages: 'express',
      type: 'PUBLIC',
      ownerId: users[0].id,
      teamId: team.id,
    },
  ];

  const projects = await Promise.all(
    projectData.map((proj) => prisma.project.create({ data: proj }))
  );

  // 5. ARCHIVED PROJECTS (User 0 archives one of their own projects)
  await prisma.project.update({
    where: { id: projects[2].id },
    data: { archeivedBy: users[0].id },
  });

  // 6. STARRED PROJECTS
  await prisma.user.update({
    where: { id: users[1].id },
    data: {
      starredProjects: {
        connect: [{ id: projects[0].id }, { id: projects[2].id }],
      },
    },
  });

  await prisma.user.update({
    where: { id: users[2].id },
    data: {
      starredProjects: {
        connect: [{ id: projects[1].id }],
      },
    },
  });

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
