import type { Metadata } from "next";
import { Bricolage_Grotesque, Open_Sans, Playfair_Display } from "next/font/google";
import { MotionConfig } from "framer-motion";
import ScrollProgress from "@/components/ScrollProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/content";
import "./globals.css";

const serif = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: "variable",
});
const sans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600"],
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Counselling, psychometric assessment, PoSH compliance and leadership training for organizations and individuals, based in Sholinganallur, Chennai.",
  openGraph: {
    title: `${site.name} | ${site.tagline}`,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${playfair.variable}`}>
      <body>
        <ScrollProgress />
        <SmoothScroll />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
