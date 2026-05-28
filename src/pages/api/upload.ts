import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

const ALLOWED_CATEGORIES = new Set(["resources", "images", "thumbnails"]);

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();

  const file = formData.get("file");
  const requestedCategory = String(formData.get("category") || "uploads");

  if (!(file instanceof File)) {
    return Response.json({ error: "Missing file" }, { status: 400 });
  }

  const category = ALLOWED_CATEGORIES.has(requestedCategory)
    ? requestedCategory
    : "uploads";

  const safeName = sanitizeFileName(file.name);
  const key = `${category}/${Date.now()}-${safeName}`;

  await env.MEDIA_BUCKET.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
  });

  const publicBaseUrl = await env.R2_PUBLIC_BASE_URL.get();

  return Response.json({
    key,
    url: `${publicBaseUrl}/${key}`,
    contentType: file.type || "application/octet-stream",
    size: file.size,
  });
};