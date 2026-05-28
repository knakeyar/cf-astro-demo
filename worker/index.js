export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/auth") {
      return new Response("Auth endpoint is wired.", {
        headers: { "content-type": "text/plain" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};