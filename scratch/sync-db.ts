import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();
const FILE_PATH = path.join(process.cwd(), "src", "data", "website_content.json");

async function main() {
  console.log("Connecting to Neon Database...");
  try {
    const config = await prisma.systemConfig.findUnique({
      where: { key: "website_content" }
    });

    if (config) {
      console.log("Database entry found. Parsing value...");
      const parsed = JSON.parse(config.value);
      
      // Save it to the local file
      fs.writeFileSync(FILE_PATH, JSON.stringify(parsed, null, 2), "utf8");
      console.log(`Success! Local file synced and written to ${FILE_PATH}`);
    } else {
      console.log("No config found in database.");
    }
  } catch (err: any) {
    console.error("Failed to sync database to local JSON:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
