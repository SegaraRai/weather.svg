import { describe, expect, it } from "vitest";
import { locationParamSchema } from "./schemas";
import { parse } from "valibot";

describe("location schema", () => {
  it("should prefer encrypted_location over latitude and longitude", () => {
    expect(
      parse(locationParamSchema, {
        encrypted_location: "test",
        latitude: "40.0",
        longitude: "140.0",
        location: "test_name",
        location_lang: "en-US",
      })
    ).toEqual({
      encrypted_location: "test",
    });

    expect(
      parse(locationParamSchema, {
        encrypted_location: "test",
        latitude: "40.0",
      })
    ).toEqual({
      encrypted_location: "test",
    });

    expect(
      parse(locationParamSchema, {
        encrypted_location: "test",
        latitude: "40.0",
        longitude: "140.0",
      })
    ).toEqual({
      encrypted_location: "test",
    });

    expect(
      parse(locationParamSchema, {
        encrypted_location: "test",
        location_name: "test_name",
      })
    ).toEqual({
      encrypted_location: "test",
    });
  });

  it("should parse latitude and longitude", () => {
    expect(
      parse(locationParamSchema, {
        latitude: "40.0",
        longitude: "140.0",
      })
    ).toEqual({
      latitude: "40.0",
      longitude: "140.0",
    });
  });

  it("should accept optional location", () => {
    expect(
      parse(locationParamSchema, {
        latitude: "40.0",
        longitude: "140.0",
        location: "test_name",
        location_lang: "en-US",
      })
    ).toEqual({
      latitude: "40.0",
      longitude: "140.0",
      location: "test_name",
      location_lang: "en-US",
    });
  });

  it("should fail if location is provided but location_lang is not", () => {
    expect(() =>
      parse(locationParamSchema, {
        latitude: "40.0",
        longitude: "140.0",
        location: "test_name",
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `[ValiError: Invalid type: Expected Object but received Object]`
    );
  });

  it("should fail if location_lang is provided but location is not", () => {
    expect(() =>
      parse(locationParamSchema, {
        latitude: "40.0",
        longitude: "140.0",
        location_lang: "en-US",
      })
    ).toThrowErrorMatchingInlineSnapshot(
      `[ValiError: Invalid type: Expected Object but received Object]`
    );
  });
});
