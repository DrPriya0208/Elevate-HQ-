import type { Metadata } from "next";
import NotFoundContent from "@/components/NotFoundContent";

export const metadata: Metadata = { title: "Page not found" };

// Shown inside the site layout when a page calls notFound(), e.g. a blog post that doesn't exist.
export default function SiteNotFound() {
  return <NotFoundContent />;
}
