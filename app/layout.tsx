import type { Metadata } from "next";
import localFont from "next/font/local";
import { MotionConfig } from "framer-motion";
import { site } from "@/lib/content";
import "./globals.css";

// The site's two faces, self-hosted from app/fonts (variable-weight Latin files from Fontsource, SIL OFL).
// Self-hosting means builds never depend on reaching Google Fonts (it was blocked on the office network,
// leaving the site in fallback fonts) and visitors' browsers never request anything from Google.
// The blog editor's extra fonts live in app/postFontLoaders.ts and load only on blog posts and in the admin.
const bricolage = localFont({
  src: "./fonts/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-serif",
  display: "swap",
  weight: "200 800",
  fallback: ["Georgia", "serif"],
});
// Variable Inter covers every weight, so semibold and bold text is real, not browser-faked.
const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Psychology, counselling, psychometric assessments, training and PoSH compliance for people at every stage of life and work, and for organisations of every size. Based in Sholinganallur, Chennai.",
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${inter.variable}`}>
      <body>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
