import type { APIContext } from "astro";

export const prerender = false;

export async function GET(_context: APIContext) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  return new Response(
    JSON.stringify({
      route: "/api/auth",
      hasClientId: Boolean(clientId),
      hasClientSecret: Boolean(clientSecret),
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}