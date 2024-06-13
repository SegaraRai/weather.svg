import { describe, expect, it } from "vitest";
import { compressDeflateRaw, decompressDeflateRaw } from "./compression";

describe("compressGzip", () => {
  it("should compress empty data", async () => {
    const data = new Uint8Array([]);
    const compressed = await compressDeflateRaw(data);
    expect(new Uint8Array(compressed)).toMatchInlineSnapshot(`
      Uint8Array [
        3,
        0,
      ]
    `);
  });

  it("should compress text data", async () => {
    const data = new TextEncoder().encode("Hello, world!\0Hello, world!\0\0");
    const compressed = await compressDeflateRaw(data);
    expect(new Uint8Array(compressed)).toMatchInlineSnapshot(`
      Uint8Array [
        243,
        72,
        205,
        201,
        201,
        215,
        81,
        40,
        207,
        47,
        202,
        73,
        81,
        100,
        240,
        64,
        225,
        49,
        0,
        0,
      ]
    `);
  });
});

describe("decompressGzip", () => {
  it("should decompress empty data", async () => {
    const data = new Uint8Array([3, 0]);
    const decompressed = await decompressDeflateRaw(data);
    expect(decompressed.byteLength).toBe(0);
  });

  it("should decompress text data", async () => {
    const data = new Uint8Array([
      243, 72, 205, 201, 201, 215, 81, 40, 207, 47, 202, 73, 81, 100, 240, 64,
      225, 49, 0, 0,
    ]);
    const decompressed = await decompressDeflateRaw(data);
    expect(new TextDecoder().decode(decompressed)).toBe(
      "Hello, world!\0Hello, world!\0\0"
    );
  });
});
