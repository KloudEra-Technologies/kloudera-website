const fs = require("fs");
const path = require("path");

const FILES_TO_UPDATE = [
  "src/app/achievements/page.tsx",
  "src/app/careers/page.tsx",
  "src/app/certifications/page.tsx",
  "src/app/clienteles/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/products/page.tsx",
  "src/app/services/page.tsx"
];

FILES_TO_UPDATE.forEach((relPath) => {
  const fullPath = path.join(process.cwd(), relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping: ${relPath}`);
    return;
  }
  let content = fs.readFileSync(fullPath, "utf8");
  if (content.includes('fetch("/api/website-content")')) {
    content = content.replace(
      'fetch("/api/website-content")',
      'fetch("/api/website-content?t=" + Date.now(), { cache: "no-store" })'
    );
    fs.writeFileSync(fullPath, content, "utf8");
    console.log(`Updated: ${relPath}`);
  } else {
    console.log(`Already updated or not found in: ${relPath}`);
  }
});
