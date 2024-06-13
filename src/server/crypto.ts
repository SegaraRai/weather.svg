export function encryptRSA(
  plaintext: BufferSource,
  publicKey: CryptoKey
): Promise<ArrayBuffer> {
  return crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    publicKey,
    plaintext
  );
}

export function decryptRSA(
  encrypted: BufferSource,
  privateKey: CryptoKey
): Promise<ArrayBuffer> {
  return crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    privateKey,
    encrypted
  );
}
