import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const prefix = url.searchParams.get("prefix") || "";

  const publicBaseUrl = await env.R2_PUBLIC_BASE_URL.get();
  const listed = await env.MEDIA_BUCKET.list({ prefix });

  return Response.json({
    objects: listed.objects.map((object) => ({
      key: object.key,
      url: `${publicBaseUrl.replace(/\/$/, "")}/${object.key}`,
      size: object.size,
      uploaded: object.uploaded,
    })),
  });
};