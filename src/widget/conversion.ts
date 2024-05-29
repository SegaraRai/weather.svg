export function identical(value: number): number {
  return value;
}

/**
 * Converts celsius to fahrenheit.
 * @param value value [°C]
 * @returns value [°F]
 */
export function celsiusToFahrenheit(value: number): number {
  return value * 1.8 + 32;
}

/**
 * Converts millimeters to inches.
 * @param value value [mm]
 * @returns value [in]
 */
export function mmToInches(value: number): number {
  return value / 25.4;
}

/**
 * Converts meters per second to miles per hour.
 * @param value value [m/s]
 * @returns value [mph]
 */
export function mpsToMph(value: number): number {
  return value * 2.23694;
}

/**
 * Converts meters per second to kilometers per hour.
 * @param value value [m/s]
 * @returns value [km/h]
 */
export function mpsToKmph(value: number): number {
  return value * 3.6;
}

/**
 * Converts meters per second to knots.
 * @param value value [m/s]
 * @returns value [kt]
 */
export function mpsToKt(value: number): number {
  return value * 1.94384;
}

/**
 * Converts hectopascals to inches of mercury.
 * @param value value [hPa]
 * @returns value [inHg]
 */
export function hPaToInHg(value: number): number {
  return value / 33.863886666667;
}

export const SPEED_CONVERSION_MAP = {
  mps: identical,
  kmph: mpsToKmph,
  mph: mpsToMph,
  knot: mpsToKt,
} as const;

export const SPEED_FRACTION_DIGITS_MAP = {
  mps: 1,
  kmph: 0,
  mph: 0,
  knot: 0,
} as const;

export const PRESSURE_CONVERSION_MAP = {
  hpa: identical,
  inhg: hPaToInHg,
} as const;

export const PRESSURE_FRACTION_DIGITS_MAP = {
  hpa: 0,
  inhg: 1,
} as const;

export const LENGTH_CONVERSION_MAP = {
  mm: identical,
  inch: mmToInches,
} as const;

export const LENGTH_FRACTION_DIGITS_MAP = {
  mm: 0,
  inch: 1,
} as const;

export const TEMPERATURE_CONVERSION_MAP = {
  celsius: identical,
  fahrenheit: celsiusToFahrenheit,
} as const;

export const TEMPERATURE_FRACTION_DIGITS_MAP = {
  celsius: 0,
  fahrenheit: 0,
} as const;

export const PERCENTAGE_FRACTION_DIGITS = 0;
