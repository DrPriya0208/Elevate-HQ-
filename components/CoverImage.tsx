import Image from "next/image";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  /** Rendered width at common breakpoints, so phones get a small file (see next/image `sizes`). */
  sizes: string;
  /** Above the fold (the post page's cover): load first instead of lazily. */
  priority?: boolean;
};

const ownPhotos = (process.env.R2_PUBLIC_URL ?? "").replace(/\/+$/, "");

/**
 * A blog cover photo. Photos from our own Cloudflare R2 bucket go through next/image, which serves a resized
 * WebP/AVIF per screen instead of the 1920px original. Any other https link an admin pasted is shown as a
 * plain lazy-loaded <img>, because next/image only optimises hosts listed in next.config.mjs.
 */
export default function CoverImage({ src, alt = "", className, sizes, priority = false }: Props) {
  if (ownPhotos && src.startsWith(`${ownPhotos}/`)) {
    return <Image src={src} alt={alt} width={1600} height={1000} sizes={sizes} priority={priority} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={className} />
  );
}
