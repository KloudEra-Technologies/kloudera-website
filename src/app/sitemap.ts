import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://kloudera.ai";
  
  // List all static public pages on the site
  const routes = [
    "",
    "/about",
    "/services",
    "/services/cyber-security",
    "/services/ai-solutions",
    "/services/cloud",
    "/services/microsoft",
    "/services/hardware",
    "/partners",
    "/certifications",
    "/products",
    "/clienteles",
    "/achievements",
    "/careers",
    "/contact",
    "/book-meeting",
    "/blogs",
    "/support",
    "/terms",
    "/privacy-policy"
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));
}
