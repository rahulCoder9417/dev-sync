import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaInstance: PrismaClient | undefined
}

 const db = globalThis.prismaInstance ?? prismaClientSingleton()
 export default db

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaInstance = db
}