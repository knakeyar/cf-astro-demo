// Provide a minimal PagesFunction type for environments where it's not
// already defined, to fix "Cannot find name 'PagesFunction'".
declare global {
  type PagesFunction<E = unknown> = (args: { request: Request; env: E }) => Promise<Response> | Response;
}

interface Env {
  GITHUB_CLIENT_ID: {
    get(): Promise<string>;
  };

  GITHUB_CLIENT_SECRET: {
    get(): Promise<string>;
  };
}

function renderBody(
  status: "success" | "error",
  content: Record<string, unknown>
): Response {
  const html = `
<!doctype html>
<html>
  <body>
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          "authorization:github:${status}:${JSON.stringify(content).replaceAll('"', '\\"')}",
          message.origin
        );

        window.removeEventListener("message", receiveMessage, false);
      };

      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
  </body>
</html>
`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return renderBody("error", {
      error: "missing_code",
      error_description: "GitHub did not return an OAuth code.",
    });
  }

  const clientId = await env.GITHUB_CLIENT_ID.get();
  const clientSecret = await env.GITHUB_CLIENT_SECRET.get();

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "cf-astro-demo-decap-cms",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const result = await tokenResponse.json<Record<string, unknown>>();

  if (!tokenResponse.ok || result.error) {
    return renderBody("error", result);
  }

  return renderBody("success", {
    token: result.access_token,
    provider: "github",
  });
};