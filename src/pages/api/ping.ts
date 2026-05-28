// src/pages/api/ping.ts
import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response("pong");
};