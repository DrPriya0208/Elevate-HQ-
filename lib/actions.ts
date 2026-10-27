"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cleanHtml } from "@/lib/sanitize";
import { makeExcerpt, slugify, stripTags } from "@/lib/text";
import type { ContactState, FormState, ReviewState } from "@/lib/types";

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

export async function loginAction(_prev: string | undefined, formData: FormData): Promise<string | undefined> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) return "Email or password is incorrect.";
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

  revalidateBlog(existing.slug);
  revalidateBlog(slug);
  redirect("/admin");
}

export async function deletePost(id: string): Promise<void> {
  await requireAdmin();
  const existing = await prisma.post.findUnique({ where: { id }, select: { slug: true } });
  if (!existing) return;
  await prisma.post.delete({ where: { id } });
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
        from: process.env.CONTACT_FROM_EMAIL || "ElevateHQ <onboarding@resend.dev>",
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
        from: process.env.CONTACT_FROM_EMAIL || "ElevateHQ <onboarding@resend.dev>",
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
