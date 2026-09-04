import { localDateKey } from './dailyStreak';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  elements: number[]; // Atomic numbers
  requiredXP: number;
}

export const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: 'Chapter 1: The Primordials',
    subtitle: 'Period 1 & 2 (H to Ne)',
    elements: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    requiredXP: 0,
  },
  {
    id: 2,
    title: 'Chapter 2: Elements of Life & Earth',
    subtitle: 'Period 3 (Na to Ar)',
    elements: [11, 12, 13, 14, 15, 16, 17, 18],
    requiredXP: 300,
  },
  {
    id: 3,
    title: 'Chapter 3: First Transition Matrix',
    subtitle: 'Period 4 (K to Kr)',
    elements: Array.from({ length: 18 }, (_, i) => 19 + i),
    requiredXP: 1000,
  },
  {
    id: 4,
    title: 'Chapter 4: Heavy Metals & Lanthanides',
    subtitle: 'Periods 5 & 6 (Rb to Rn)',
    elements: Array.from({ length: 50 }, (_, i) => 37 + i),
    requiredXP: 2500,
  },
  {
    id: 5,
    title: 'Chapter 5: Superheavy Frontiers',
    subtitle: 'Period 7 & Transactinides (Fr to Og)',
    elements: Array.from({ length: 32 }, (_, i) => 87 + i),
    requiredXP: 5000,
  },
];

export function getNextChapterElement(chapter: Chapter, levels: Record<number, number>): number {
  return chapter.elements.find(z => (levels[z] || 0) < 2) ?? chapter.elements[0];
}

export const ACHIEVEMENTS_LIST = [
  {
    id: 'first_discovery',
    title: 'Quantum Genesis',
    description: 'Synthesize and discover your first chemical element.',
    icon: '⚡',
    xpReward: 50,
  },
  {
    id: 'noble_master',
    title: 'Noble Octet',
    description: 'Discover all 7 Noble Gases (He, Ne, Ar, Kr, Xe, Rn, Og).',
    icon: '✨',
    xpReward: 150,
  },
  {
    id: 'fusion_pioneer',
    title: 'Thermonuclear Pioneer',
    description: 'Synthesize an element using the Nuclear Fusion Chamber.',
    icon: '💥',
    xpReward: 100,
  },
  {
    id: 'streak_master',
    title: 'Chain Reaction',
    description: 'Achieve a 5x answer streak in the Quiz.',
    icon: '🔥',
    xpReward: 120,
  },
  {
    id: 'superheavy',
    title: 'Island of Stability',
    description: 'Synthesize a superheavy element with Z ≥ 104.',
    icon: '🌌',
    xpReward: 200,
  },
  {
    id: 'hundred_club',
    title: 'Master Chemist',
    description: 'Accumulate over 1,000 total Research XP.',
    icon: '🏆',
    xpReward: 250,
  },
];

export function getAchievement(id: string) {
  return ACHIEVEMENTS_LIST.find(achievement => achievement.id === id);
}

export function checkAchievements(
  discovered: number[],
  xp: number,
  unlockedIds: string[]
): { newUnlocked: string[]; totalBonusXP: number } {
  const newUnlocked: string[] = [];
  let totalBonusXP = 0;

  const nobleGases = [2, 10, 18, 36, 54, 86, 118];
  const hasAllNobles = nobleGases.every(z => discovered.includes(z));
  const hasSuperheavy = discovered.some(z => z >= 104);

  for (const ach of ACHIEVEMENTS_LIST) {
    if (unlockedIds.includes(ach.id)) continue;

    let qualifies = false;
    if (ach.id === 'first_discovery' && discovered.length >= 1) qualifies = true;
    if (ach.id === 'noble_master' && hasAllNobles) qualifies = true;
    if (ach.id === 'superheavy' && hasSuperheavy) qualifies = true;
    if (ach.id === 'hundred_club' && xp >= 1000) qualifies = true;

    if (qualifies) {
      newUnlocked.push(ach.id);
      totalBonusXP += ach.xpReward;
    }
  }

  return { newUnlocked, totalBonusXP };
}

// Daily Quest Generator based on calendar day
export function getDailyFeaturedElement(today: Date = new Date()): { z: number; dateStr: string; bonusXP: number } {
  const dateStr = localDateKey(today);
  // Deterministic daily element based on day of year
  const dayOfYear = Math.floor((Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) - Date.UTC(today.getFullYear(), 0, 0)) / 86400000);
  const z = (dayOfYear % 118) + 1;
  return { z, dateStr, bonusXP: 100 };
}
