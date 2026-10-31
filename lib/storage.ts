import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Cloudflare R2 through the standard S3 API, so another S3-compatible provider only needs new env values.
function config() {
  const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL } = process.env;
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_URL) return null;
  return {
    bucket: R2_BUCKET,
    publicUrl: R2_PUBLIC_URL.replace(/\/+$/, ""),
    client: new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
    }),
  };
}

export function storageConfigured(): boolean {
  return config() !== null;
}

export async function uploadPhoto(file: File, extension: string): Promise<string> {
  const c = config();
  if (!c) throw new Error("Photo storage is not configured.");

  const key = `blog/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  await c.client.send(
    new PutObjectCommand({
      Bucket: c.bucket,
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${c.publicUrl}/${key}`;
}

/** Deletes a photo only if the URL points into our own bucket; other links are left alone. */
export async function deletePhoto(url?: string | null): Promise<void> {
  const c = config();
  if (!c || !url || !url.startsWith(`${c.publicUrl}/`)) return;
  try {
    await c.client.send(new DeleteObjectCommand({ Bucket: c.bucket, Key: url.slice(c.publicUrl.length + 1) }));
  } catch (err) {
    console.error("Could not delete photo", err);
  }
}
