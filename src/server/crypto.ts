/*
export function decrypt(data: string, key: string): string {
  // RSA-OAEP decryption

  crypto.subtle.importKey(
    "jwk",
    {
      kty: "RSA",
      e: "AQAB",
      n: "yM4ZQ2v6w7a3q2t1s5z0q1r
    },
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    false,
    ["decrypt"]
  );

  crypto.subtle.decrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    data
  );
}

export function encrypt(data: string, key: string): string {
  
}
*/
