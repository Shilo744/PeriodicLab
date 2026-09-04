import { isRecord, nonnegativeInteger } from './storageSchema';
import { localDateKey } from './dailyStreak';

export const WEEKLY_GOAL_TARGET = 7;
export const WEEKLY_GOAL_REWARD = 250;

export interface WeeklyGoal {
  weekKey: string;
  actions: number;
  rewarded: boolean;
}

export function localWeekKey(now: Date): string {
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  return localDateKey(monday);
}

export function normalizeWeeklyGoal(value: unknown, now: Date = new Date()): WeeklyGoal {
  const currentWeek = localWeekKey(now);
  if (!isRecord(value) || value.weekKey !== currentWeek) return { weekKey: currentWeek, actions: 0, rewarded: false };
  const actions = Math.min(WEEKLY_GOAL_TARGET, nonnegativeInteger(value.actions));
  return { weekKey: currentWeek, actions, rewarded: value.rewarded === true && actions >= WEEKLY_GOAL_TARGET };
}

export function recordWeeklyAction(value: unknown, now: Date = new Date()): WeeklyGoal {
  const current = normalizeWeeklyGoal(value, now);
  const actions = Math.min(WEEKLY_GOAL_TARGET, current.actions + 1);
  return { ...current, actions, rewarded: current.rewarded || actions >= WEEKLY_GOAL_TARGET };
}
