import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ["", "/about", "/services", "/blog", "/reviews", "/contact"].map((path) => ({
    url: `${site.url}${path}`,
    lastModified: new Date(),
  }));

  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    return [...pages, ...posts.map((p) => ({ url: `${site.url}/blog/${p.slug}`, lastModified: p.updatedAt }))];
  } catch {
    return pages;
  }
}
