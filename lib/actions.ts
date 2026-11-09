"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { clientIp, passedHumanCheck, underLimit } from "@/lib/protection";
import { cleanHtml } from "@/lib/sanitize";
import { deletePhoto } from "@/lib/storage";
import { makeExcerpt, slugify, stripTags } from "@/lib/text";
import {
  TICKET_COOKIE,
  TICKET_MINUTES,
  checkAdminPassword,
  createTicket,
  emailCodeAvailable,
  newEmailCode,
  ticketIsValid,
  twoFactorEnabled,
} from "@/lib/twoFactor";
import type { ContactState, FormState, LoginState, ReviewState } from "@/lib/types";

/* ---------- helpers ---------- */

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
}

function revalidateBlog(slug?: string) {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
}

/** The src of every <img> in a post body (already sanitised HTML). */
function imageUrls(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)].map((m) => m[1]);
}

/** Prisma's error for a unique constraint (two posts saved with the same slug at the same moment). */
function isUniqueConflict(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && (err as { code?: string }).code === "P2002";
}

/**
 * Deletes photos from our bucket, but only ones no other post still uses (the same link can be pasted
 * into two posts, and deleting is permanent). deletePhoto itself ignores links outside our bucket.
 */
async function deleteUnusedPhotos(urls: Array<string | null | undefined>, excludePostId: string) {
  const unique = [...new Set(urls.filter((u): u is string => Boolean(u)))];
  for (const url of unique) {
    const usedElsewhere = await prisma.post.findFirst({
      where: { id: { not: excludePostId }, OR: [{ coverImage: url }, { content: { contains: url } }] },
      select: { id: true },
    });
    if (!usedElsewhere) await deletePhoto(url);
  }
}

const HUMAN_CHECK_FAILED = "We could not confirm you are not a bot. Please wait for the security check to finish and try again.";

const SLUG_TAKEN = "Another post already uses that web address. Change the slug and save again.";

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 2;
  while (
    await prisma.post.findFirst({
      where: { slug: candidate, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    })
  ) {
    candidate = `${root}-${n++}`;
  }
  return candidate;
}

/* ---------- login ---------- */

const TOO_MANY_SIGN_INS = "Too many sign-in attempts. Please wait 15 minutes and try again.";
const SIGN_IN_TIMED_OUT = "Your sign-in timed out. Please enter your password again.";

async function setTicketCookie(ticket: string) {
  (await cookies()).set(TICKET_COOKIE, ticket, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: TICKET_MINUTES * 60,
  });
}

async function sendSignInCodeEmail(code: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Elevate HQ <onboarding@resend.dev>",
        to: [process.env.ADMIN_EMAIL],
        subject: `Your Elevate HQ admin sign-in code: ${code}`,
        text:
          `Your sign-in code is ${code}\n\nIt works for ${TICKET_MINUTES} minutes, once.\n\n` +
          "If you did not just try to sign in to the Elevate HQ admin, someone knows your password: change it now.",
      }),
    });
    if (!res.ok) console.error("Resend responded with", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Could not send sign-in code email", err);
    return false;
  }
}

/**
 * Admin sign-in, in up to two steps. The form's "intent" says which:
 * - "password" (default): email + password. With two-factor off this signs in; with it on, a correct
 *   password earns a 10-minute ticket cookie and the code screen.
 * - "code": the 6-digit code from the authenticator app or the email, checked with the ticket.
 * - "email-code": email a code to the admin address instead of using the app.
 * - "restart": back to the password screen.
 */
export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const intent = String(formData.get("intent") ?? "password");
  const jar = await cookies();
  const ticket = jar.get(TICKET_COOKIE)?.value;
  const ip = await clientIp();

  if (intent === "restart") {
    jar.delete({ name: TICKET_COOKIE, path: "/admin" });
    return { step: "password" };
  }

  if (intent === "email-code") {
    if (!ticketIsValid(ticket)) return { step: "password", error: SIGN_IN_TIMED_OUT };
    if (!emailCodeAvailable()) return { step: "code", error: "Email codes are not set up yet. Use the code from your authenticator app." };
    if (!(await underLimit("loginEmailCode", ip))) {
      return { step: "code", error: "Several codes have been emailed already. Check your inbox and spam folder, or wait 15 minutes." };
    }
    const code = newEmailCode();
    if (!(await sendSignInCodeEmail(code))) {
      return { step: "code", error: "We could not send the email. Use the code from your authenticator app, or try again shortly." };
    }
    await setTicketCookie(createTicket(code)); // the new code replaces any earlier emailed one
    return { step: "code", notice: `We emailed a code to the admin address. It works for ${TICKET_MINUTES} minutes.` };
  }

  if (intent === "code") {
    if (!ticketIsValid(ticket)) return { step: "password", error: SIGN_IN_TIMED_OUT };
    if (!(await underLimit("loginIp", ip))) return { step: "code", error: TOO_MANY_SIGN_INS };
    try {
      await signIn("credentials", { ticket, code: String(formData.get("code") ?? ""), redirect: false });
    } catch (error) {
      if (error instanceof AuthError) return { step: "code", error: "That code is not right, or it has expired. Try the latest one." };
      throw error;
    }
    jar.delete({ name: TICKET_COOKIE, path: "/admin" });
    redirect("/admin");
  }

  // Step 1: email and password
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");
  if (!(await underLimit("loginIp", ip)) || !(await underLimit("loginEmail", email || "blank"))) {
    return { step: "password", error: TOO_MANY_SIGN_INS };
  }
  if (!(await passedHumanCheck(formData, ip))) return { step: "password", error: HUMAN_CHECK_FAILED };

  if (twoFactorEnabled()) {
    if (!(await checkAdminPassword(email, password))) return { step: "password", error: "Email or password is incorrect." };
    await setTicketCookie(createTicket());
    return { step: "code" };
  }

  try {
    await signIn("credentials", { email, password, redirectTo: "/admin" });
  } catch (error) {
    if (error instanceof AuthError) return { step: "password", error: "Email or password is incorrect." };
    throw error; // lets the success redirect through
  }
}

/* ---------- blog posts ---------- */

const postSchema = z.object({
  title: z.string().trim().min(3, "Add a title of at least 3 characters.").max(140, "Keep the title under 140 characters."),
  slug: z.string().trim().max(160),
  excerpt: z.string().trim().max(300, "Keep the summary under 300 characters."),
  coverImage: z.union([z.literal(""), z.string().trim().url("Cover image must be a full link starting with https://")]),
  content: z.string(),
});

function readPost(formData: FormData) {
  const parsed = postSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    excerpt: String(formData.get("excerpt") ?? ""),
    coverImage: String(formData.get("coverImage") ?? ""),
    content: String(formData.get("content") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const content = cleanHtml(parsed.data.content);
  if (stripTags(content).length === 0) return { error: "Write some content before saving." };

  return { data: { ...parsed.data, content } };
}

export async function createPost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = readPost(formData);
  if ("error" in result) return { error: result.error };

  const { data } = result;
  const published = formData.get("published") === "on";
  const slug = await uniqueSlug(data.slug || data.title);

  try {
    await prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || makeExcerpt(data.content),
        content: data.content,
        coverImage: data.coverImage || null,
        published,
        publishedAt: published ? new Date() : null,
      },
    });
  } catch (err) {
    if (isUniqueConflict(err)) return { error: SLUG_TAKEN };
    throw err;
  }

  revalidateBlog(slug);
  redirect("/admin");
}

export async function updatePost(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const result = readPost(formData);
  if ("error" in result) return { error: result.error };

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { error: "This post no longer exists." };

  const { data } = result;
  const published = formData.get("published") === "on";
  const slug = await uniqueSlug(data.slug || data.title, id);

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt || makeExcerpt(data.content),
        content: data.content,
        coverImage: data.coverImage || null,
        published,
        publishedAt: published ? existing.publishedAt ?? new Date() : null,
      },
    });
  } catch (err) {
    if (isUniqueConflict(err)) return { error: SLUG_TAKEN };
    throw err;
  }

  // Only after the save succeeded: remove photos this edit stopped using (a replaced cover, images
  // taken out of the body). deletePhoto ignores anything outside our own bucket.
  const stillUsed = new Set([data.coverImage, ...imageUrls(data.content)].filter(Boolean));
  const dropped = [existing.coverImage, ...imageUrls(existing.content)].filter((u) => u && !stillUsed.has(u));
  await deleteUnusedPhotos(dropped, id);

  revalidateBlog(existing.slug);
  revalidateBlog(slug);
  redirect("/admin");
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  const existing = await prisma.post.findUnique({ where: { id }, select: { slug: true, coverImage: true, content: true } });
  if (!existing) return;
  await prisma.post.delete({ where: { id } });
  // The cover and every image inside the post, unless another post uses the same photo
  await deleteUnusedPhotos([existing.coverImage, ...imageUrls(existing.content)], id);
  revalidateBlog(existing.slug);
  revalidatePath("/admin");
}

/* ---------- contact form ---------- */

const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(200),
  phone: z.string().trim().max(30),
  interest: z.string().trim().max(80),
  organisation: z.string().trim().max(120, "Keep the organization name under 120 characters."),
  message: z.string().trim().min(10, "Please write a few words about how we can help.").max(3000, "Please keep the message under 3000 characters."),
});

async function sendEnquiryEmail(e: z.infer<typeof enquirySchema>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Elevate HQ <onboarding@resend.dev>",
        to: [to],
        reply_to: e.email,
        subject: `New enquiry from ${e.name}`,
        text: `Name: ${e.name}\nEmail: ${e.email}\nPhone: ${e.phone || "-"}\nOrganization: ${e.organisation || "-"}\nInterested in: ${e.interest}\n\n${e.message}`,
      }),
    });
    if (!res.ok) console.error("Resend responded with", res.status, await res.text());
  } catch (err) {
    console.error("Could not send enquiry email", err);
  }
}

export async function submitEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("website") ?? "") !== "") return { ok: true };

  const ip = await clientIp();
  if (!(await underLimit("enquiry", ip))) {
    return { error: "You have sent several messages in a short time. Please try again in an hour, or call or WhatsApp us." };
  }
  if (!(await passedHumanCheck(formData, ip))) return { error: HUMAN_CHECK_FAILED };

  const parsed = enquirySchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    interest: String(formData.get("interest") ?? ""),
    organisation: String(formData.get("organisation") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const e = parsed.data;
  try {
    await prisma.enquiry.create({
      data: {
        name: e.name,
        email: e.email,
        phone: e.phone || null,
        interest: e.interest,
        organisation: e.organisation || null,
        message: e.message,
      },
    });
  } catch (err) {
    console.error("Could not save enquiry", err);
    return { error: "We could not send your message. Please call or WhatsApp us instead." };
  }

  await sendEnquiryEmail(e);
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteEnquiry(id: string): Promise<void> {
  await requireAdmin();
  await prisma.enquiry.deleteMany({ where: { id } }); // deleteMany: no error if it was already removed
  revalidatePath("/admin");
}

/* ---------- reviews ---------- */

function revalidateReviews() {
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}

const reviewSchema = z.object({
  name: z.string().trim().max(60, "Keep the name under 60 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters so we understand your feedback.")
    .max(800, "Keep your feedback under 800 characters."),
});

async function sendReviewEmail(name: string, rating: number, message: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!key || !to) return;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || "Elevate HQ <onboarding@resend.dev>",
        to: [to],
        subject: "New review awaiting approval",
        text: `${name} left a ${rating}-star review:\n\n${message}`,
      }),
    });
    if (!res.ok) console.error("Resend responded with", res.status, await res.text());
  } catch (err) {
    console.error("Could not send review notification email", err);
  }
}

export async function submitReview(_prev: ReviewState, formData: FormData): Promise<ReviewState> {
  // Honeypot: real visitors never fill this hidden field.
  if (String(formData.get("website") ?? "") !== "") return { ok: true };

  // Reject submissions made less than 3 seconds after the form rendered.
  const renderedAt = Number(formData.get("renderedAt") ?? 0);
  if (!renderedAt || Date.now() - renderedAt < 3000) return { ok: true };

  const ip = await clientIp();
  if (!(await underLimit("review", ip))) {
    return { error: "You have sent several reviews in a short time. Please try again in an hour." };
  }
  if (!(await passedHumanCheck(formData, ip))) return { error: HUMAN_CHECK_FAILED };

  const rating = Number(formData.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Please choose a star rating." };
  }

  if (formData.get("consent") !== "on") {
    return { error: "Please agree to your feedback being shown before sending." };
  }

  const parsed = reviewSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  const name = parsed.data.name || "Anonymous";

  try {
    await prisma.review.create({
      data: { name, rating, message: parsed.data.message, consent: true },
    });
  } catch (err) {
    console.error("Could not save review", err);
    return { error: "We could not save your feedback. Please try again shortly." };
  }

  await sendReviewEmail(name, rating, parsed.data.message);
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
  return { ok: true };
}

export async function approveReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { status: "APPROVED", approvedAt: new Date() } });
  revalidateReviews();
}

export async function hideReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { status: "HIDDEN", featured: false } });
  revalidateReviews();
}

export async function featureReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { featured: true } });
  revalidateReviews();
}

export async function unfeatureReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { featured: false } });
  revalidateReviews();
}

export async function deleteReview(id: string): Promise<void> {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidateReviews();
}

const reviewEditSchema = z.object({
  name: z.string().trim().max(60, "Keep the name under 60 characters."),
  message: z
    .string()
    .trim()
    .min(20, "Please write at least 20 characters.")
    .max(800, "Keep the message under 800 characters."),
});

export async function updateReview(id: string, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const parsed = reviewEditSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };

  await prisma.review.update({
    where: { id },
    data: { name: parsed.data.name || "Anonymous", message: parsed.data.message },
  });

  revalidateReviews();
  redirect("/admin/reviews");
}
