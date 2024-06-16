import type { PreferencesSchema } from "./schemas";

export function formatDateTime(
  datetime: string,
  language: string,
  timeFormat: Exclude<PreferencesSchema["time_format"], "auto">
): [weekday: string, dateTime: string] {
  const date = new Date(datetime + "Z");
  return [
    date.toLocaleString(language, {
      timeZone: "UTC",
      weekday: "long",
    }),
    date.toLocaleString(language, {
      timeZone: "UTC",
      ...(timeFormat === "native"
        ? { dateStyle: "medium", timeStyle: "short" }
        : {
            month: "short",
            day: "numeric",
            hour: timeFormat === "24h" ? "2-digit" : "numeric",
            hour12: timeFormat === "12h",
            minute: "2-digit",
          }),
    }),
  ];
}
