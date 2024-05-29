import { expect, it } from "vitest";
import { getClosestLanguage } from "./getClosestLanguage";

it("should return the exact language if it exists", () => {
  expect(getClosestLanguage("en-US", ["en-US", "ja-JP"])).toBe("en-US");
  expect(getClosestLanguage("de", ["en-US", "ja-JP", "de"])).toBe("de");
  expect(
    getClosestLanguage("ja-Kana-JP", ["en-US", "ja-JP", "ja-Kana-JP"])
  ).toBe("ja-Kana-JP");
});

it("should return null if relevant languages do not exist", () => {
  expect(getClosestLanguage("sv", ["en-US", "ja-JP", "de", "ja-Kana-JP"])).toBe(
    null
  );
  expect(
    getClosestLanguage("sv-SE", ["en-US", "ja-JP", "de", "ja-Kana-JP"])
  ).toBe(null);
  expect(
    getClosestLanguage("sv-Latn-SE", ["en-US", "ja-JP", "de", "ja-Kana-JP"])
  ).toBe(null);
});

it("should return the closest language if it exists", () => {
  expect(getClosestLanguage("en", ["en-US", "ja-JP"])).toBe("en-US");
  expect(getClosestLanguage("en-BR", ["en-US", "ja-JP"])).toBe("en-US");
  expect(getClosestLanguage("en-Latn", ["en-US", "ja-JP"])).toBe("en-US");
  expect(getClosestLanguage("en-Latn-BR", ["en-US", "ja-JP"])).toBe("en-US");
  expect(getClosestLanguage("en-Latn-US", ["en-US", "ja-JP"])).toBe("en-US");

  expect(getClosestLanguage("en-Latn", ["en-US", "en-Latn-BR", "ja-JP"])).toBe(
    "en-Latn-BR"
  );
  expect(getClosestLanguage("en-Latn", ["en-US", "en-Latn-US", "ja-JP"])).toBe(
    "en-Latn-US"
  );
  expect(getClosestLanguage("en-BR", ["en-US", "en-Latn-BR", "ja-JP"])).toBe(
    "en-Latn-BR"
  );
});

it("should return the minimum language if multiple languages are equally close", () => {
  expect(getClosestLanguage("en-BR", ["en-US", "en-Latn-US", "ja-JP"])).toBe(
    "en-US"
  );
  expect(getClosestLanguage("en", ["en-US", "en-Latn-US", "ja-JP"])).toBe(
    "en-US"
  );
});
