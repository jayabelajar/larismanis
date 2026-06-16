import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: "https://larismanis.id/",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://larismanis.id/calculator",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://larismanis.id/about",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://larismanis.id/presets",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
