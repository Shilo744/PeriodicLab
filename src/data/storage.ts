import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  XP: 'periodic_lab_xp',
  LEVELS: 'periodic_lab_levels',
  POOL: 'periodic_lab_pool',
  ACHIEVEMENTS: 'periodic_lab_achievements',
  DAILY: 'periodic_lab_daily',
  FLASHCARDS: 'periodic_lab_flashcards',
  FAVORITE_REACTIONS: 'periodic_lab_favorite_reactions',
  PREFERENCES: 'periodic_lab_preferences',
  LAST_TAB: 'periodic_lab_last_tab',
  LAST_ELEMENT: 'periodic_lab_last_element',
};

export async function saveLastElement(z: number): Promise<void> {
  const value = String(Math.max(1, Math.min(118, z)));
  try { await AsyncStorage.setItem(KEYS.LAST_ELEMENT, value); } catch { memoryCache[KEYS.LAST_ELEMENT] = value; }
}

export async function loadLastElement(): Promise<number> {
  try { return Number(await AsyncStorage.getItem(KEYS.LAST_ELEMENT)) || 6; }
  catch { return Number(memoryCache[KEYS.LAST_ELEMENT]) || 6; }
}

export async function saveLastTab(tab: string): Promise<void> {
  try { await AsyncStorage.setItem(KEYS.LAST_TAB, tab); } catch { memoryCache[KEYS.LAST_TAB] = tab; }
}

export async function loadLastTab(): Promise<string> {
  try { return (await AsyncStorage.getItem(KEYS.LAST_TAB)) || 'home'; }
  catch { return memoryCache[KEYS.LAST_TAB] || 'home'; }
}

export interface AppPreferences { locale: 'en' | 'he'; audioMuted: boolean; }
const DEFAULT_PREFERENCES: AppPreferences = { locale: 'en', audioMuted: false };

export async function loadPreferences(): Promise<AppPreferences> {
  try {
    const value = await AsyncStorage.getItem(KEYS.PREFERENCES);
    return value ? { ...DEFAULT_PREFERENCES, ...JSON.parse(value) } : DEFAULT_PREFERENCES;
  } catch { return memoryCache[KEYS.PREFERENCES] ? { ...DEFAULT_PREFERENCES, ...JSON.parse(memoryCache[KEYS.PREFERENCES]) } : DEFAULT_PREFERENCES; }
}

export async function savePreferences(update: Partial<AppPreferences>): Promise<void> {
  const value = JSON.stringify({ ...(await loadPreferences()), ...update });
  try { await AsyncStorage.setItem(KEYS.PREFERENCES, value); }
  catch { memoryCache[KEYS.PREFERENCES] = value; }
}

export async function saveFavoriteReactions(ids: string[]): Promise<void> {
  const value = JSON.stringify([...new Set(ids)]);
  try { await AsyncStorage.setItem(KEYS.FAVORITE_REACTIONS, value); }
  catch { memoryCache[KEYS.FAVORITE_REACTIONS] = value; }
}

export async function loadFavoriteReactions(): Promise<string[]> {
  try {
    const value = await AsyncStorage.getItem(KEYS.FAVORITE_REACTIONS);
    if (value !== null) return JSON.parse(value);
  } catch {
    if (memoryCache[KEYS.FAVORITE_REACTIONS]) return JSON.parse(memoryCache[KEYS.FAVORITE_REACTIONS]);
  }
  return [];
}

export async function saveMasteredFlashcards(elements: number[]): Promise<void> {
  const value = JSON.stringify([...new Set(elements)]);
  try {
    await AsyncStorage.setItem(KEYS.FLASHCARDS, value);
  } catch (err) {
    memoryCache[KEYS.FLASHCARDS] = value;
  }
}

export async function loadMasteredFlashcards(): Promise<number[]> {
  try {
    const value = await AsyncStorage.getItem(KEYS.FLASHCARDS);
    if (value !== null) return JSON.parse(value);
  } catch (err) {
    if (memoryCache[KEYS.FLASHCARDS]) return JSON.parse(memoryCache[KEYS.FLASHCARDS]);
  }
  return [];
}

// In-memory fallback if storage fails
const memoryCache: Record<string, string> = {};

export async function saveXP(xp: number): Promise<void> {
  try {
    const val = String(xp);
    await AsyncStorage.setItem(KEYS.XP, val);
  } catch (err) {
    console.warn('Failed to save XP to storage, using fallback:', err);
    memoryCache[KEYS.XP] = String(xp);
  }
}

export async function loadXP(): Promise<number> {
  try {
    const val = await AsyncStorage.getItem(KEYS.XP);
    if (val !== null) return parseInt(val, 10) || 0;
  } catch (err) {
    console.warn('Failed to load XP from storage, using fallback:', err);
    if (memoryCache[KEYS.XP]) return parseInt(memoryCache[KEYS.XP], 10) || 0;
  }
  return 0;
}

export async function saveLevels(levels: Record<number, number>): Promise<void> {
  try {
    const val = JSON.stringify(levels);
    await AsyncStorage.setItem(KEYS.LEVELS, val);
  } catch (err) {
    console.warn('Failed to save levels to storage, using fallback:', err);
    memoryCache[KEYS.LEVELS] = JSON.stringify(levels);
  }
}

export async function loadLevels(): Promise<Record<number, number>> {
  try {
    const val = await AsyncStorage.getItem(KEYS.LEVELS);
    if (val !== null) return JSON.parse(val);
  } catch (err) {
    console.warn('Failed to load levels from storage, using fallback:', err);
    if (memoryCache[KEYS.LEVELS]) return JSON.parse(memoryCache[KEYS.LEVELS]);
  }
  return {};
}

export async function saveStudyPool(pool: number[]): Promise<void> {
  try {
    const val = JSON.stringify(pool);
    await AsyncStorage.setItem(KEYS.POOL, val);
  } catch (err) {
    console.warn('Failed to save study pool to storage, using fallback:', err);
    memoryCache[KEYS.POOL] = JSON.stringify(pool);
  }
}

export async function loadStudyPool(defaultPool: number[]): Promise<number[]> {
  try {
    const val = await AsyncStorage.getItem(KEYS.POOL);
    if (val !== null) return JSON.parse(val);
  } catch (err) {
    console.warn('Failed to load study pool from storage, using fallback:', err);
    if (memoryCache[KEYS.POOL]) return JSON.parse(memoryCache[KEYS.POOL]);
  }
  return defaultPool;
}

export async function saveAchievements(unlockedIds: string[]): Promise<void> {
  try {
    const val = JSON.stringify(unlockedIds);
    await AsyncStorage.setItem(KEYS.ACHIEVEMENTS, val);
  } catch (err) {
    console.warn('Failed to save achievements to storage:', err);
    memoryCache[KEYS.ACHIEVEMENTS] = JSON.stringify(unlockedIds);
  }
}

export async function loadAchievements(): Promise<string[]> {
  try {
    const val = await AsyncStorage.getItem(KEYS.ACHIEVEMENTS);
    if (val !== null) return JSON.parse(val);
  } catch (err) {
    console.warn('Failed to load achievements:', err);
    if (memoryCache[KEYS.ACHIEVEMENTS]) return JSON.parse(memoryCache[KEYS.ACHIEVEMENTS]);
  }
  return [];
}

export async function saveDailyStreak(streak: number, lastDate: string): Promise<void> {
  try {
    const val = JSON.stringify({ streak, lastDate });
    await AsyncStorage.setItem(KEYS.DAILY, val);
  } catch (err) {
    memoryCache[KEYS.DAILY] = JSON.stringify({ streak, lastDate });
  }
}

export async function loadDailyStreak(): Promise<{ streak: number; lastDate: string }> {
  try {
    const val = await AsyncStorage.getItem(KEYS.DAILY);
    if (val !== null) return JSON.parse(val);
  } catch (err) {
    if (memoryCache[KEYS.DAILY]) return JSON.parse(memoryCache[KEYS.DAILY]);
  }
  return { streak: 1, lastDate: new Date().toISOString().split('T')[0] };
}

function localDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function updateDailyStreak(): Promise<{ streak: number; lastDate: string }> {
  const saved = await loadDailyStreak();
  const today = localDateKey();
  if (saved.lastDate === today) return saved;
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const streak = saved.lastDate === localDateKey(yesterdayDate) ? saved.streak + 1 : 1;
  await saveDailyStreak(streak, today);
  return { streak, lastDate: today };
}

export function isElementUnlocked(z: number, xp: number, levels: Record<number, number>): boolean {
  if (z <= 3) return true; // H, He, Li are unlocked by default
  const prevLevel = levels[z - 1] || 0;
  const reqXP = (z - 3) * 120;
  return prevLevel >= 2 || xp >= reqXP;
}
