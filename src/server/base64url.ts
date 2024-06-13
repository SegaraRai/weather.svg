import { encodeBase64Url as honoEncodeBase64Url } from "hono/utils/encode";
export { decodeBase64Url as decodeBase64URL } from "hono/utils/encode";

export function encodeBase64URL(buffer: ArrayBufferLike): string {
  return honoEncodeBase64Url(buffer).replaceAll("=", "");
}
