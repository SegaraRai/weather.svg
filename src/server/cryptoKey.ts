export function importPrivateKey(strPrivateJWK: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "jwk",
    JSON.parse(strPrivateJWK),
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    false,
    ["decrypt"]
  );
}

export function derivePublicKey(strPrivateJWK: string): Promise<CryptoKey> {
  const privateJWK = JSON.parse(strPrivateJWK);

  return crypto.subtle.importKey(
    "jwk",
    {
      key_ops: ["encrypt"],
      kty: privateJWK.kty,
      n: privateJWK.n,
      e: privateJWK.e,
      alg: privateJWK.alg,
      ext: true,
    },
    {
      name: "RSA-OAEP",
      hash: { name: "SHA-256" },
    },
    true,
    ["encrypt"]
  );
}
