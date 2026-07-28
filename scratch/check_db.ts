import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking database...");
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "website_content" }
    });
    if (config) {
      console.log("FOUND CONFIG!");
      const parsed = JSON.parse(config.value);
      console.log("Credentials:", parsed.credentials);
      console.log("Partners Title:", parsed.partners?.title);
      console.log("Partners Tagline:", parsed.partners?.tagline);
      console.log("Alliances count:", parsed.partners?.alliances?.length);
    } else {
      console.log("NO website_content CONFIG FOUND IN DATABASE!");
    }
  } catch (err) {
    console.error("Database query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
