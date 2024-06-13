import { parse } from "valibot";
import {
  plainLocationSchema,
  type LocationParamSchema,
  type PlainLocationSchema,
} from "./schemas";
import { decryptRSA, encryptRSA } from "./crypto";
import { decodeBase64URL, encodeBase64URL } from "./base64url";

export interface LocationParseResult {
  location: PlainLocationSchema;
  encrypted: boolean;
}

export async function decryptLocation(
  encryptedLocation: string,
  privateKey: CryptoKey
): Promise<unknown> {
  return JSON.parse(
    new TextDecoder().decode(
      await decryptRSA(decodeBase64URL(encryptedLocation), privateKey)
    )
  ) as unknown;
}

export async function encryptLocation(
  location: PlainLocationSchema,
  publicKey: CryptoKey
): Promise<string> {
  return encodeBase64URL(
    await encryptRSA(
      new TextEncoder().encode(JSON.stringify(location)),
      publicKey
    )
  );
}

export async function parseLocation(
  location: LocationParamSchema,
  privateKey: CryptoKey
): Promise<LocationParseResult | null> {
  try {
    const [plainLocation, encrypted] =
      "encrypted_location" in location
        ? [await decryptLocation(location.encrypted_location, privateKey), true]
        : [location, false];

    return {
      location: parse(plainLocationSchema, plainLocation),
      encrypted,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn("Failed to parse location", error);
    }

    // discard the error to avoid leaking sensitive information
    return null;
  }
}
