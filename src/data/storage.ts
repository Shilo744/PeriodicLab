import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPersistence } from './persistence';
import { REACTIONS } from './reactions';
import { isElementId, isRecord, nonnegativeInteger, elementIds, stringIds, levelsRecord, preferences, AppPreferences } from './storageSchema';
export type { AppPreferences } from './storageSchema';

// Keep existing key names so upgrades retain saved progress.
const KEYS = {
  XP: 'periodic_lab_xp', LEVELS: 'periodic_lab_levels', POOL: 'periodic_lab_pool',
  ACHIEVEMENTS: 'periodic_lab_achievements', DAILY: 'periodic_lab_daily',
  FLASHCARDS: 'periodic_lab_flashcards', FAVORITE_REACTIONS: 'periodic_lab_favorite_reactions',
  PREFERENCES: 'periodic_lab_preferences', LAST_TAB: 'periodic_lab_last_tab', LAST_ELEMENT: 'periodic_lab_last_element',
};
const store = createPersistence(AsyncStorage);
const validTab = (value: unknown): string => typeof value === 'string' && ['home', 'table', 'study', 'builder', 'quiz'].includes(value) ? value : 'home';
const validElement = (value: unknown): number => isElementId(value) ? value : 6;
const validFavorites = (value: unknown) => stringIds(value).filter(id => REACTIONS.some(r => r.id === id));

export const saveLastElement = (z: number) => store.write(KEYS.LAST_ELEMENT, validElement(z));
export const loadLastElement = () => store.read(KEYS.LAST_ELEMENT, validElement);
export const saveLastTab = (tab: string) => store.write(KEYS.LAST_TAB, validTab(tab));
export const loadLastTab = () => store.read(KEYS.LAST_TAB, validTab);
export const loadPreferences = () => store.read(KEYS.PREFERENCES, preferences);
export async function savePreferences(update: Partial<AppPreferences>): Promise<void> {
  await store.update(KEYS.PREFERENCES, preferences, previous => ({ ...previous, ...update }));
}
export const saveFavoriteReactions = (ids: string[]) => store.write(KEYS.FAVORITE_REACTIONS, validFavorites(ids));
export const loadFavoriteReactions = () => store.read(KEYS.FAVORITE_REACTIONS, validFavorites);
export const saveMasteredFlashcards = (ids: number[]) => store.write(KEYS.FLASHCARDS, elementIds(ids));
export const loadMasteredFlashcards = () => store.read(KEYS.FLASHCARDS, elementIds);
export const saveXP = (xp: number) => store.write(KEYS.XP, nonnegativeInteger(xp));
export const loadXP = () => store.read(KEYS.XP, nonnegativeInteger);
export const saveLevels = (levels: Record<number, number>) => store.write(KEYS.LEVELS, levelsRecord(levels));
export const loadLevels = () => store.read(KEYS.LEVELS, levelsRecord);
export const saveStudyPool = (pool: number[]) => store.write(KEYS.POOL, elementIds(pool));
export const loadStudyPool = (defaultPool: number[]): Promise<number[]> => store.read(KEYS.POOL, value => {
  const pool = elementIds(value);
  return pool.length ? pool : (elementIds(defaultPool).length ? elementIds(defaultPool) : [1, 2, 3]);
});
export const saveAchievements = (ids: string[]) => store.write(KEYS.ACHIEVEMENTS, stringIds(ids));
export const loadAchievements = () => store.read(KEYS.ACHIEVEMENTS, stringIds);

export async function saveDailyStreak(streak: number, lastDate: string): Promise<void> {
  await store.write(KEYS.DAILY, { streak: Math.max(1, nonnegativeInteger(streak)), lastDate });
}
export async function loadDailyStreak(): Promise<{ streak: number; lastDate: string }> {
  return store.read(KEYS.DAILY, value => isRecord(value) && typeof value.lastDate === 'string'
    ? { streak: Math.max(1, nonnegativeInteger(value.streak)), lastDate: value.lastDate }
    : { streak: 1, lastDate: new Date().toISOString().split('T')[0] });
}
function localDateKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export async function updateDailyStreak(): Promise<{ streak: number; lastDate: string }> {
  const saved = await loadDailyStreak();
  const today = localDateKey();
  if (saved.lastDate === today) return saved;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const streak = saved.lastDate === localDateKey(yesterday) ? saved.streak + 1 : 1;
  await saveDailyStreak(streak, today);
  return { streak, lastDate: today };
}
export function isElementUnlocked(z: number, xp: number, levels: Record<number, number>): boolean {
  if (z <= 3) return true;
  return (levels[z - 1] || 0) >= 2 || xp >= (z - 3) * 120;
}
