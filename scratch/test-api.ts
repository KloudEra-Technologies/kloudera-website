import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  console.log("Simulating GET /api/website-content...");
  const start = Date.now();
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "website_content" }
    });
    console.log(`Prisma read done in ${Date.now() - start}ms.`);
    if (config) {
      console.log("Value exists in DB. Length:", config.value.length);
    } else {
      console.log("Value does not exist in DB.");
    }
  } catch (err: any) {
    console.log(`Prisma read failed in ${Date.now() - start}ms:`, err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
