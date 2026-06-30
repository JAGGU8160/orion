import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://orion-space-digest.vercel.app/sitemap.xml",
    host: "https://orion-space-digest.vercel.app",
  };
}
