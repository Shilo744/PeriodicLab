import { isRecord, nonnegativeInteger } from './storageSchema';
export interface DailyStreak { streak: number; lastDate: string; }

export function localDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function normalizeStreak(value: unknown): DailyStreak {
  if (isRecord(value) && typeof value.lastDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value.lastDate)) {
    const [y, m, d] = value.lastDate.split('-').map(Number);
    if (localDateKey(new Date(y, m - 1, d)) === value.lastDate && nonnegativeInteger(value.streak) > 0) {
      return { streak: nonnegativeInteger(value.streak), lastDate: value.lastDate };
    }
  }
  return { streak: 0, lastDate: '' };
}
export function advanceDailyStreak(value: DailyStreak, now: Date): DailyStreak {
  const saved = normalizeStreak(value);
  const today = localDateKey(now);
  if (saved.lastDate === today) return saved;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1); // Calendar day, not a fixed 24-hour interval.
  return { streak: saved.lastDate === localDateKey(yesterday) ? saved.streak + 1 : 1, lastDate: today };
}
