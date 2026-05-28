/// <reference types="astro/client" />

type SecretsStoreSecret = {
  get(): Promise<string>;
};

declare module "cloudflare:workers" {
  namespace Cloudflare {
    interface Env {
      GITHUB_CLIENT_ID: SecretsStoreSecret;
      GITHUB_CLIENT_SECRET: SecretsStoreSecret;
    }
  }
}