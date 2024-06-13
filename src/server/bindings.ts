import type { KVNamespace } from "@cloudflare/workers-types";

export type Bindings = {
  readonly KV_FETCH_CACHE: KVNamespace;

  readonly API_KEY_BIG_DATA_CLOUD: string;
  readonly JWK_RSA_PRIVATE_KEY: string;

  readonly PROXY_URL: string;
  readonly PROXY_AUTHORIZATION: string;
};
