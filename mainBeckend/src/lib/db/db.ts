import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaInstance: PrismaClient | undefined
}

export const db = globalThis.prismaInstance ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaInstance = db
}