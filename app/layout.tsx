import type { Metadata } from "next";
import { Bricolage_Grotesque, Open_Sans, Playfair_Display, Inter } from "next/font/google";
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
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500"],
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
    <html lang="en" className={`${serif.variable} ${sans.variable} ${playfair.variable} ${inter.variable}`}>
      <body>
        <ScrollProgress />
        <SmoothScroll />
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </body>
    </html>
  );
}
