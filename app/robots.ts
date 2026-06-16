import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/calculator", "/about", "/presets"],
        disallow: ["/account", "/history", "/login", "/register", "/api/"],
      },
    ],
    sitemap: "https://larismanis.id/sitemap.xml",
  };
}
