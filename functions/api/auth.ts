interface Env {
  GITHUB_CLIENT_ID: {
    get(): Promise<string>;
  };
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);

  const clientId = await env.GITHUB_CLIENT_ID.get();

  const redirectUri = `${url.origin}/api/callback`;

  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");

  githubAuthUrl.searchParams.set("client_id", clientId);
  githubAuthUrl.searchParams.set("redirect_uri", redirectUri);

  // repo = read/write private repos if user has access.
  // public_repo = public repos only.
  githubAuthUrl.searchParams.set("scope", "repo user");

  githubAuthUrl.searchParams.set(
    "state",
    crypto.getRandomValues(new Uint8Array(16)).join("")
  );

  return Response.redirect(githubAuthUrl.toString(), 302);
};