import type { KVNamespace } from "@cloudflare/workers-types";
import { encodeBase64URL } from "./base64url";

export async function cachedFetch(
  url: string | URL,
  kv: KVNamespace,
  ttl: number | ((data: unknown) => number),
  fetcher: (url: string | URL) => Promise<Response> = fetch
): Promise<unknown> {
  const urlHash = encodeBase64URL(
    await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(url.toString())
    )
  );
  const cacheKey = `${new URL(url).origin};${urlHash}`;

  const kvResult = await kv.get(cacheKey, "json");
  if (kvResult) {
    return kvResult;
  }

  const response = await fetcher(url);
  if (!response.ok) {
    throw response;
  }

  const networkResult = await response.json();
  const ttlValue = typeof ttl === "function" ? ttl(networkResult) : ttl;
  await kv.put(cacheKey, JSON.stringify(networkResult), {
    expirationTtl: ttlValue,
  });

  return networkResult;
}
