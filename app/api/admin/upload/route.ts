import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { storageConfigured, uploadPhoto } from "@/lib/storage";

// Kept under Vercel's ~4.5 MB request limit; the browser shrinks photos before upload anyway.
const MAX_BYTES = 4 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received." }, { status: 400 });

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Please upload a JPEG, PNG, WebP, GIF or AVIF image." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be under 4 MB." }, { status: 400 });
  }

  if (!storageConfigured()) {
    return NextResponse.json(
      { error: "Photo uploads are not configured yet. Add the R2_* settings to the environment." },
      { status: 500 },
    );
  }

  try {
    const url = await uploadPhoto(file, extension);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("Photo upload failed", err);
    return NextResponse.json({ error: "Could not upload the photo. Please try again." }, { status: 500 });
  }
}
