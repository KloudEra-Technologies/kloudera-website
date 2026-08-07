async function main() {
  console.log("Fetching local API /api/website-content...");
  try {
    const res = await fetch("http://localhost:3000/api/website-content");
    console.log("Status:", res.status);
    const json = await res.json();
    console.log("Certifications items exists:", Boolean(json.certifications?.items));
    if (json.certifications?.items) {
      console.log("Certifications items count:", json.certifications.items.length);
    }
    console.log("Partners featured exists:", Boolean(json.partners?.featured));
    if (json.partners?.featured) {
      console.log("Partners featured count:", json.partners.featured.length);
    }
  } catch (err) {
    console.error("Fetch failed:", err.message);
  }
}

main();
