export const isRecord = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export const isElementId = (value: unknown): value is number => typeof value === 'number' && Number.isInteger(value) && value >= 1 && value <= 118;
export const nonnegativeInteger = (value: unknown): number => typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : 0;
export const elementIds = (value: unknown): number[] => Array.isArray(value) ? [...new Set(value.filter(isElementId))] : [];
export const stringIds = (value: unknown): string[] => Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === 'string' && id.length > 0))] : [];
export function levelsRecord(value: unknown): Record<number, number> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter(([key]) => isElementId(Number(key))).map(([key, level]) => [Number(key), nonnegativeInteger(level)]));
}
export interface AppPreferences { locale: 'en' | 'he'; audioMuted: boolean; }
export function preferences(value: unknown): AppPreferences {
  const saved = isRecord(value) ? value : {};
  return { locale: saved.locale === 'he' ? 'he' : 'en', audioMuted: saved.audioMuted === true };
}
