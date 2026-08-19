import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  XP: 'periodic_lab_xp',
  LEVELS: 'periodic_lab_levels',
  POOL: 'periodic_lab_pool',
};

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

export function isElementUnlocked(z: number, xp: number, levels: Record<number, number>): boolean {
  if (z <= 3) return true; // H, He, Li are unlocked by default
  const prevLevel = levels[z - 1] || 0;
  const reqXP = (z - 3) * 120;
  return prevLevel >= 2 || xp >= reqXP;
}
