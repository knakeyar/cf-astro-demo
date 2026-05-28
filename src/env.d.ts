/// <reference types="astro/client" />

type SecretsStoreSecret = {
  get(): Promise<string>;
};

declare module "cloudflare:workers" {
  namespace Cloudflare {
    interface Env {
      GITHUB_CLIENT_ID: SecretsStoreSecret;
      GITHUB_CLIENT_SECRET: SecretsStoreSecret;
      MEDIA_BUCKET: R2Bucket;
      R2_PUBLIC_BASE_URL: SecretsStoreSecret;
    }
  }
}