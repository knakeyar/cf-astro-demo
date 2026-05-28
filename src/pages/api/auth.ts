import type { APIRoute } from "astro";
import { env } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const clientId = await env.GITHUB_CLIENT_ID.get();

  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/callback`;

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
  githubAuthUrl.searchParams.set("scope", "repo user");
  githubAuthUrl.searchParams.set("state", crypto.randomUUID());

  return Response.redirect(githubAuthUrl.toString(), 302);
};