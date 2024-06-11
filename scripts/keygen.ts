import { webcrypto as crypto } from "node:crypto";

const { privateKey } = await crypto.subtle.generateKey(
  {
    name: "RSA-OAEP",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]), // 65537
    hash: { name: "SHA-256" },
  },
  true,
  ["encrypt", "decrypt"]
);

const privateJWK = await crypto.subtle.exportKey("jwk", privateKey);
privateJWK.ext = false;

console.log("Private key:");
console.log(JSON.stringify(privateJWK));
console.log("");

const publicJWKDerived: typeof privateJWK = {
  key_ops: ["encrypt"],
  kty: privateJWK.kty,
  n: privateJWK.n,
  e: privateJWK.e,
  alg: privateJWK.alg,
  ext: true,
};

console.log("Public key (derived):");
console.log(JSON.stringify(publicJWKDerived));
console.log("");

// Test the keys

const plaintext = "Hello, world!";
const plaintextBytes = new TextEncoder().encode(plaintext);

const publicKeyDerived = await crypto.subtle.importKey(
  "jwk",
  publicJWKDerived,
  {
    name: "RSA-OAEP",
    hash: { name: "SHA-256" },
  },
  true,
  ["encrypt"]
);

const ciphers = await Promise.all(
  new Array(2).fill(null).map(() =>
    crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKeyDerived,
      plaintextBytes
    )
  )
);

const privateKeyImported = await crypto.subtle.importKey(
  "jwk",
  privateJWK,
  {
    name: "RSA-OAEP",
    hash: { name: "SHA-256" },
  },
  false,
  ["decrypt"]
);

const decryptedTexts = await Promise.all(
  ciphers.map(async (cipher) =>
    new TextDecoder().decode(
      await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP",
        },
        privateKeyImported,
        cipher
      )
    )
  )
);

console.log("Key Test:");
console.log("- Original:", plaintext);

for (const [i, cipher] of ciphers.entries()) {
  const index = i + 1;

  console.log(
    `- Encrypted ${index}:`,
    `[${cipher.byteLength} bytes]`,
    Array.from(new Uint8Array(cipher))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("")
  );
  console.log(`- Decrypted ${index}:`, decryptedTexts[i]);
}
