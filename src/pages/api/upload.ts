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
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const requestedCategory = String(formData.get("category") || "resources");

    if (!(file instanceof File)) {
      return Response.json({ error: "Missing file" }, { status: 400 });
    }

    const category = ALLOWED_CATEGORIES.has(requestedCategory)
      ? requestedCategory
      : "resources";

    const safeName = sanitizeFileName(file.name);
    const key = `${category}/${Date.now()}-${safeName}`;
    const contentType = file.type || "application/octet-stream";

    await env.MEDIA_BUCKET.put(key, file.stream(), {
      httpMetadata: {
        contentType,
        contentDisposition: `attachment; filename="${safeName}"`,
      },
    });

    const publicBaseUrl = await env.R2_PUBLIC_BASE_URL.get();

    if (!publicBaseUrl) {
      return Response.json(
        {
          error: "Upload succeeded, but R2_PUBLIC_BASE_URL is missing.",
          key,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      key,
      url: `${publicBaseUrl.replace(/\/$/, "")}/${key}`,
      contentType,
      size: file.size,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown upload error",
      },
      { status: 500 }
    );
  }
};