import { getClosestLanguage } from "../getClosestLanguage";
import translations_en_us from "./en-US.yaml";
import translations_ja_jp from "./ja-JP.yaml";

const TRANSLATION_MAP = {
  "en-US": translations_en_us,
  "ja-JP": translations_ja_jp,
} as const;

export type TranslationLanguage = keyof typeof TRANSLATION_MAP;

const TRANSLATION_LANGUAGES = Object.keys(
  TRANSLATION_MAP
) as readonly TranslationLanguage[];

export const FALLBACK_LANGUAGE = "en-US" satisfies TranslationLanguage;

export function getTranslationLanguage(
  desiredLanguage: string
): TranslationLanguage {
  return (
    getClosestLanguage(desiredLanguage, TRANSLATION_LANGUAGES) ??
    FALLBACK_LANGUAGE
  );
}

export function getTranslation(
  language: TranslationLanguage | null,
  key: string
): string | undefined {
  return TRANSLATION_MAP[language ?? FALLBACK_LANGUAGE][key];
}
