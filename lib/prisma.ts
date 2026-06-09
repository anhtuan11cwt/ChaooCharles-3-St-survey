import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/lib/generated/prisma/client";

// Singleton — tránh tạo nhiều instance PrismaClient khi hot-reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL ?? "";
  const adapter = new PrismaMariaDb(connectionString);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Giữ instance trong global scope khi dev để tránh recreate
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
