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
        location_name: "test_name",
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

  it("should accept optional location_name", () => {
    expect(
      parse(locationParamSchema, {
        latitude: "40.0",
        longitude: "140.0",
        location_name: "test_name",
      })
    ).toEqual({
      latitude: "40.0",
      longitude: "140.0",
      location_name: "test_name",
    });
  });
});
