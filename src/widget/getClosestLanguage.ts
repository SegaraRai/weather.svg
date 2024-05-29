import { type Schema, parse } from "bcp-47";

/**
 * Calculates the similarity score between two nullable strings. \
 * The score is 2 if both strings are equal, including when both are null. \
 * The score is 1 if one of the strings is null. \
 * The score is 0 if the strings are different.
 */
function calcMatchScore(
  a: string | null | undefined,
  b: string | null | undefined
): number {
  a ??= null;
  b ??= null;

  if (a === b) {
    return 2;
  }
  if (a == null || b == null) {
    return 1;
  }
  return 0;
}

/**
 * Calculates the similarity score between two language tags.
 *
 * The score weights the following components:
 * - Language: 16 points
 * - Region: 4 points
 * - Script: 1 point
 *
 * The score is 0 if the languages are different.
 */
function calcLanguageScore(a: Schema, b: Schema): number {
  const languageScore = calcMatchScore(a.language, b.language);
  if (languageScore === 0) {
    // Different languages, no need to compare further
    return 0;
  }

  const regionScore = calcMatchScore(a.region, b.region);
  const scriptScore = calcMatchScore(a.script, b.script);
  return languageScore * 16 + regionScore * 4 + scriptScore;
}

export function getClosestLanguage<T extends string = string>(
  desiredLanguage: string,
  availableLanguages: readonly T[]
): T | null {
  const desired = parse(desiredLanguage);
  if (!desired.language) {
    return null;
  }

  return (
    availableLanguages
      .map(
        (language) =>
          [language, calcLanguageScore(desired, parse(language))] as const
      )
      .filter(([, score]) => score > 0)
      .sort(([, a], [, b]) => b - a)[0]?.[0] ?? null
  );
}
