import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPersistence } from './persistence';
import { REACTIONS } from './reactions';
import { isElementId, nonnegativeInteger, elementIds, stringIds, levelsRecord, preferences, AppPreferences } from './storageSchema';
import { normalizeStreak, advanceDailyStreak, DailyStreak } from './dailyStreak';
import { normalizeWeeklyGoal, WeeklyGoal } from './weeklyGoal';
export type { AppPreferences } from './storageSchema';

// Keep existing key names so upgrades retain saved progress.
const KEYS = {
  XP: 'periodic_lab_xp', LEVELS: 'periodic_lab_levels', POOL: 'periodic_lab_pool',
  ACHIEVEMENTS: 'periodic_lab_achievements', DAILY: 'periodic_lab_daily',
  FLASHCARDS: 'periodic_lab_flashcards', FAVORITE_REACTIONS: 'periodic_lab_favorite_reactions',
  PREFERENCES: 'periodic_lab_preferences', LAST_TAB: 'periodic_lab_last_tab', LAST_ELEMENT: 'periodic_lab_last_element',
  DAILY_QUEST: 'periodic_lab_daily_quest',
  ONBOARDING: 'periodic_lab_onboarding_complete',
  WEEKLY_GOAL: 'periodic_lab_weekly_goal',
};
const store = createPersistence(AsyncStorage);
const validTab = (value: unknown): string => typeof value === 'string' && ['home', 'table', 'study', 'builder', 'quiz'].includes(value) ? value : 'home';
const validElement = (value: unknown): number => isElementId(value) ? value : 6;
const validFavorites = (value: unknown) => stringIds(value).filter(id => REACTIONS.some(r => r.id === id));
const validDateKey = (value: unknown): string => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : '';

export const saveDailyQuestCompletion = (date: string) => store.write(KEYS.DAILY_QUEST, validDateKey(date));
export const loadDailyQuestCompletion = () => store.read(KEYS.DAILY_QUEST, validDateKey);
export const saveOnboardingComplete = () => store.write(KEYS.ONBOARDING, true);
export const loadOnboardingComplete = () => store.read(KEYS.ONBOARDING, value => value === true);
export const saveWeeklyGoal = (goal: WeeklyGoal) => store.write(KEYS.WEEKLY_GOAL, normalizeWeeklyGoal(goal));
export const loadWeeklyGoal = () => store.read(KEYS.WEEKLY_GOAL, value => normalizeWeeklyGoal(value));

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
  await store.write(KEYS.DAILY, normalizeStreak({ streak, lastDate }));
}
export async function loadDailyStreak(): Promise<DailyStreak> {
  return store.read(KEYS.DAILY, normalizeStreak);
}
export async function updateDailyStreak(): Promise<DailyStreak> {
  const now = new Date();
  return store.update(KEYS.DAILY, normalizeStreak, saved => advanceDailyStreak(saved, now));
}
export function isElementUnlocked(z: number, xp: number, levels: Record<number, number>): boolean {
  if (z <= 3) return true;
  return (levels[z - 1] || 0) >= 2 || xp >= (z - 3) * 120;
}
