import type { MetadataRoute } from "next";
import { site } from "@/lib/content";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No lastModified on static pages: stamping them "now" on every regeneration teaches search engines to
  // ignore the dates. Blog posts below carry their real updatedAt.
  const pages = ["", "/about", "/services", "/blog", "/reviews", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${site.url}${path}`,
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
