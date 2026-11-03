"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";

/**
 * Share links for a blog post. Instagram has no web share link, so that button opens the
 * phone's share sheet where available and otherwise copies the link to paste into Instagram.
 */
export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { name: "X", icon: "x", href: `https://twitter.com/intent/tweet?url=${u}&text=${t}` },
    { name: "Facebook", icon: "facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { name: "Instagram", icon: "instagram", href: null },
    { name: "WhatsApp", icon: "whatsapp", href: `https://wa.me/?text=${t}%20${u}` },
    { name: "LinkedIn", icon: "linkedin", href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "Reddit", icon: "reddit", href: `https://www.reddit.com/submit?url=${u}&title=${t}` },
  ];

  const shareToInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as DOMException).name === "AbortError") return; // visitor closed the share sheet
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      window.prompt("Copy this link to share on Instagram:", url);
    }
  };

  const btn =
    "flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-navy transition-colors duration-300 hover:border-gold hover:bg-gold";

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <p className="font-semibold text-navy">Share this article:</p>
      <ul className="flex flex-wrap gap-2.5">
        {links.map((l) => (
          <li key={l.name}>
            {l.href ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${l.name}, opens in a new tab`} title={l.name} className={btn}>
                <Icon name={l.icon} className="h-[18px] w-[18px]" />
              </a>
            ) : (
              <button type="button" onClick={shareToInstagram} aria-label={`Share on ${l.name}`} title={l.name} className={btn}>
                <Icon name={l.icon} className="h-[18px] w-[18px]" />
              </button>
            )}
          </li>
        ))}
      </ul>
      <p role="status" className="w-full text-sm text-brass empty:hidden">
        {copied ? "Link copied. Paste it into your Instagram story, post or message." : ""}
      </p>
    </div>
  );
}
