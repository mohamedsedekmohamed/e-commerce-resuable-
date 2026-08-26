export type LocalizedText = string | Record<string, string>;

/**
 * Return a translated API value while safely falling back to English.
 * API responses can contain either a plain string or a locale-keyed object.
 */
export function getLocalizedText(
  value: LocalizedText | null | undefined,
  locale: string,
  fallback = ""
): string {
  if (typeof value === "string") {
    return value;
  }

  return value?.[locale] ?? value?.en ?? fallback;
}

export type DashboardFormValues = Record<string, unknown>;
