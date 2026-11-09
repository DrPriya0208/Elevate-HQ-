import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import * as OTPAuth from "otpauth";

/*
 * Admin sign-in helpers: the password check and the second step (two-factor).
 *
 * When ADMIN_TOTP_SECRET is set, a correct password alone no longer signs in. The visitor gets a
 * signed "ticket" (in an httpOnly cookie, valid 10 minutes) proving the password was right, and must
 * then enter either the 6-digit code from an authenticator app, or a code emailed to ADMIN_EMAIL.
 * The emailed code is never stored: only an HMAC of it travels inside the signed ticket.
 * Delete ADMIN_TOTP_SECRET to switch two-factor off (emergency recovery).
 */

export const TICKET_COOKIE = "ehq-2fa";
export const TICKET_MINUTES = 10;

const ADMIN = { id: "admin", name: "Admin" };

function signingKey(): string {
  const key = process.env.AUTH_SECRET;
  if (!key) throw new Error("AUTH_SECRET is not set");
  return key;
}

const hmac = (data: string) => createHmac("sha256", signingKey()).update(data).digest("base64url");

function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/* ---------- password ---------- */

/** The admin user when the email and password match the configured admin, otherwise null. */
export async function checkAdminPassword(emailInput: unknown, passwordInput: unknown) {
  const email = String(emailInput ?? "").toLowerCase().trim();
  const password = String(passwordInput ?? "");
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const hashB64 = process.env.ADMIN_PASSWORD_HASH_B64;
  if (!adminEmail || !hashB64 || email !== adminEmail) return null;

  const hash = Buffer.from(hashB64, "base64").toString("utf8");
  return (await bcrypt.compare(password, hash)) ? { ...ADMIN, email: adminEmail } : null;
}

/* ---------- authenticator app (TOTP) ---------- */

export const twoFactorEnabled = () => Boolean(process.env.ADMIN_TOTP_SECRET?.trim());

/** True for the current 6-digit app code (or the one just before or after, to allow for clock drift). */
export function verifyAppCode(code: string): boolean {
  const secret = process.env.ADMIN_TOTP_SECRET?.trim();
  if (!secret || !/^\d{6}$/.test(code)) return false;
  const totp = new OTPAuth.TOTP({ secret: OTPAuth.Secret.fromBase32(secret), digits: 6, period: 30, algorithm: "SHA1" });
  return totp.validate({ token: code, window: 1 }) !== null;
}

/* ---------- emailed code ---------- */

export const emailCodeAvailable = () => Boolean(process.env.RESEND_API_KEY && process.env.ADMIN_EMAIL);

export function newEmailCode(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, "0");
}

/* ---------- ticket: "the password was right", signed and short-lived ---------- */

type Ticket = { exp: number; nonce: string; emailCodeHash?: string };

export function createTicket(emailCode?: string): string {
  const nonce = randomBytes(16).toString("base64url");
  const ticket: Ticket = {
    exp: Date.now() + TICKET_MINUTES * 60_000,
    nonce,
    ...(emailCode ? { emailCodeHash: hmac(`email-code:${nonce}:${emailCode}`) } : {}),
  };
  const body = Buffer.from(JSON.stringify(ticket)).toString("base64url");
  return `${body}.${hmac(`ticket:${body}`)}`;
}

function readTicket(token: string): Ticket | null {
  const [body, sig] = token.split(".");
  if (!body || !sig || !safeEqual(sig, hmac(`ticket:${body}`))) return null;
  try {
    const ticket = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as Ticket;
    return typeof ticket.exp === "number" && ticket.exp > Date.now() ? ticket : null;
  } catch {
    return null;
  }
}

export const ticketIsValid = (token: string | undefined) => Boolean(token && readTicket(token));

/**
 * The admin user when the ticket is genuine and unexpired and the code is either the current app
 * code or the code emailed for this ticket; otherwise null. Used by the NextAuth authorize step, so
 * the second factor cannot be skipped by calling the sign-in endpoint directly.
 */
export function checkSecondStep(ticketToken: unknown, codeInput: unknown) {
  const ticket = readTicket(String(ticketToken ?? ""));
  const code = String(codeInput ?? "").replace(/\s/g, "");
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  if (!ticket || !adminEmail || !/^\d{6}$/.test(code)) return null;

  const emailOk = Boolean(ticket.emailCodeHash && safeEqual(ticket.emailCodeHash, hmac(`email-code:${ticket.nonce}:${code}`)));
  return emailOk || verifyAppCode(code) ? { ...ADMIN, email: adminEmail } : null;
}
