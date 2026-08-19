export type Locale = 'en' | 'he';

export const STRINGS = {
  en: {
    appTitle: 'Periodic Lab',
    appSubtitle: 'Quantum Mechanics & Element Synthesis',
    modules: 'LABORATORY MODULES',
    study: 'Study',
    studyDesc: '3D Shells & Isotopes',
    builder: 'Builder',
    builderDesc: 'Fusion & Particle Tuning',
    quiz: 'Quiz',
    quizDesc: 'Speed Bonus & Streaks',
    table: 'Table',
    tableDesc: 'Search & Filters',
    dailyQuest: 'DAILY RESEARCH QUEST',
    chapters: 'RESEARCH CHAPTERS',
    achievements: 'RESEARCH ACHIEVEMENTS',
    synthesize: 'Synthesize',
    discovered: 'Discovered',
    locked: 'Locked',
    correct: 'Correct!',
    incorrect: 'Incorrect',
    protons: 'Protons',
    neutrons: 'Neutrons',
    electrons: 'Electrons',
    mass: 'Mass (u)',
  },
  he: {
    appTitle: 'מעבדה מחזורית',
    appSubtitle: 'מכניקת קוונטים וסינתוז יסודות',
    modules: 'מודולי מעבדה',
    study: 'לימוד',
    studyDesc: 'קליפות 3D ואיזוטופים',
    builder: 'בנייה',
    builderDesc: 'היתוך וכוונון חלקיקים',
    quiz: 'חידון',
    quizDesc: 'בונוס מהירות ורצפים',
    table: 'טבלה',
    tableDesc: 'חיפוש ופילטרים',
    dailyQuest: 'אתגר מחקר יומי',
    chapters: 'פרקי מחקר',
    achievements: 'הישגי מחקר',
    synthesize: 'סנתז',
    discovered: 'התגלה',
    locked: 'נעול',
    correct: 'נכון!',
    incorrect: 'לא נכון',
    protons: 'פרוטונים',
    neutrons: 'נויטרונים',
    electrons: 'אלקטרונים',
    mass: 'מסה (u)',
  }
};

export function t(key: keyof typeof STRINGS.en, locale: Locale = 'en'): string {
  return STRINGS[locale][key] || STRINGS.en[key];
}
