import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/*
 * Spam and brute-force protection for the public forms and the admin login.
 *
 * Two layers, each switched on by its own environment variables, so the site keeps working
 * (unprotected) while a key is missing, for example on a developer's machine:
 * - Cloudflare Turnstile proves a person is behind the browser (TURNSTILE_SECRET_KEY, plus
 *   NEXT_PUBLIC_TURNSTILE_SITE_KEY for the widget).
 * - Upstash rate limits cap how often one visitor can submit or try to log in, which also stops
 *   a person guessing the admin password by hand (UPSTASH_REDIS_REST_URL / _TOKEN).
 */

/** The visitor's IP address, as reported by the hosting proxy (Vercel sets x-forwarded-for). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "unknown";
}

/* ---------- rate limits (Upstash) ---------- */

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
    : null;

function limiter(prefix: string, tokens: number, window: Parameters<typeof Ratelimit.slidingWindow>[1]) {
  return redis ? new Ratelimit({ redis, prefix: `elevatehq:${prefix}`, limiter: Ratelimit.slidingWindow(tokens, window) }) : null;
}

const limits = {
  // Real visitors send one enquiry or one review; a few retries after a typo still fit.
  enquiry: limiter("enquiry", 5, "1 h"),
  review: limiter("review", 3, "1 h"),
  // Per IP, and per typed email so spreading guesses across many IPs does not help either.
  loginIp: limiter("login-ip", 10, "15 m"),
  loginEmail: limiter("login-email", 20, "1 h"),
};

export type LimitName = keyof typeof limits;

/**
 * True when this key is still under its limit. Fails open: if Upstash is not configured or
 * cannot be reached, the request is allowed (and logged), so an outage never locks out real
 * visitors or the admin. Turnstile and the honeypot still apply.
 */
export async function underLimit(name: LimitName, key: string): Promise<boolean> {
  const l = limits[name];
  if (!l) return true;
  try {
    const { success } = await l.limit(key);
    return success;
  } catch (err) {
    console.error(`Rate limit check "${name}" failed; allowing the request`, err);
    return true;
  }
}

/* ---------- human check (Cloudflare Turnstile) ---------- */

/** The form field the Turnstile widget fills with its one-time token. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

/**
 * True when Cloudflare confirms the token. Skipped (true) when TURNSTILE_SECRET_KEY is not set.
 * If Cloudflare itself cannot be reached the request is allowed and logged, because the rate
 * limits still apply; a token Cloudflare looked at and rejected is always refused.
 */
export async function passedHumanCheck(formData: FormData, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;

  const token = String(formData.get(TURNSTILE_FIELD) ?? "");
  if (!token) return false;

  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error(`siteverify responded ${res.status}`);
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) console.warn("Turnstile rejected a submission", data["error-codes"]);
    return Boolean(data.success);
  } catch (err) {
    console.error("Could not reach Cloudflare Turnstile; allowing the request", err);
    return true;
  }
}
