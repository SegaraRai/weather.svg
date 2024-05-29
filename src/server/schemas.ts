import {
  custom,
  union,
  object,
  string,
  nullish,
  type InferOutput,
  pipe,
} from "valibot";
import { isValidLanguageTag } from "../widget/schemas";

function isValidDecimal(decimal: unknown): decimal is string {
  return (
    typeof decimal === "string" &&
    /^[+-]?\d+(?:\.\d*)?/.test(decimal) &&
    isFinite(parseFloat(decimal))
  );
}

function isValidLatitude(latitude: unknown): latitude is string {
  return (
    isValidDecimal(latitude) &&
    parseFloat(latitude) >= -90 &&
    parseFloat(latitude) <= 90
  );
}

function isValidLongitude(longitude: unknown): longitude is string {
  return (
    isValidDecimal(longitude) &&
    parseFloat(longitude) >= -180 &&
    parseFloat(longitude) <= 180
  );
}

export const plainLocationSchema = pipe(
  object({
    latitude: pipe(
      string("latitude must be a string"),
      custom(isValidLatitude, "latitude must be a valid latitude")
    ),
    longitude: pipe(
      string("longitude must be a string"),
      custom(isValidLongitude, "longitude must be a valid longitude")
    ),
    location: nullish(string("location_name must be a string")),
    location_lang: nullish(
      pipe(
        string("location_lang must be a string"),
        custom(isValidLanguageTag, "invalid location_lang string specified")
      )
    ),
  }),
  custom((param) => {
    if (typeof param !== "object") {
      return false;
    }
    const hasLocation = (param as any).location != null;
    const hasLocationLang = (param as any).location_lang != null;
    return hasLocation === hasLocationLang;
  }, "location and location_lang must be both present or both absent")
);

export type PlainLocationSchema = InferOutput<typeof plainLocationSchema>;

export const encryptedLocationSchema = object({
  encrypted_location: string("encrypted_location must be a string"),
});

export type EncryptedLocationSchema = InferOutput<
  typeof encryptedLocationSchema
>;

export const locationParamSchema = union([
  // encryptedLocationSchema has precedence over plainLocationSchema
  encryptedLocationSchema,
  plainLocationSchema,
]);

export type LocationParamSchema = InferOutput<typeof locationParamSchema>;
