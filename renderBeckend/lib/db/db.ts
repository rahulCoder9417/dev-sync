import { PrismaClient } from "@prisma/client";
export const db = new PrismaClient({
    datasources: {
      db: {
        url: process.env.POOL_DATABASE_URL || process.env.DATABASE_URL
      }
    }
  });