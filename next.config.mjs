const isDev = process.env.NODE_ENV !== "production";

/**
 * Content Security Policy.
 * - Scripts: Next.js inlines small bootstrap scripts, so 'unsafe-inline' is needed without per-request
 *   nonces (nonces would force every page to render dynamically and drop ISR caching). Dev also needs
 *   'unsafe-eval' for React Refresh and a websocket for hot reload.
 * - Styles: inline style attributes are used by blog post spans (fonts/sizes) and by components.
 * - Images: cover and in-post images come from Cloudflare R2 or any https link an admin pastes.
 * - Everything else (fonts, the WebGL data files, uploads, server actions) is same-origin.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
  "media-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Older browsers that ignore frame-ancestors: stops the admin panel being framed (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]),
];

// Blog photos live in Cloudflare R2 behind this public URL; next/image may resize images from it.
const photoHost = (() => {
  try {
    return process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : null;
  } catch {
    return null;
  }
})();

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: photoHost ? [{ protocol: "https", hostname: photoHost }] : [],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
