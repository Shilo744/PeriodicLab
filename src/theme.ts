export const COLORS = {
  bg: '#0a0e1a',
  bgLight: '#111827',
  bgCard: 'rgba(17, 24, 45, 0.75)',
  surface: 'rgba(255,255,255,0.05)',

  primary: '#6366f1',
  primaryLight: '#818cf8',
  accent: '#a78bfa',

  success: '#34d399',
  successBg: 'rgba(52,211,153,0.10)',

  text: '#e2e8f0',
  textSecondary: '#94a3b8',
  textTertiary: '#64748b',
  textInverse: '#020617',

  border: 'rgba(255, 255, 255, 0.10)',
  borderLight: 'rgba(255, 255, 255, 0.06)',
  borderGlow: 'rgba(99, 102, 241, 0.12)',

  tabActive: '#a78bfa',
  tabInactive: '#475569',

  atomBg: 'transparent',

  category: {
    'Nonmetal': '#22d3ee',
    'Noble gas': '#a78bfa',
    'Alkali metal': '#f472b6',
    'Alkaline earth': '#fbbf24',
    'Metalloid': '#34d399',
    'Post-transition': '#60a5fa',
    'Transition metal': '#818cf8',
    'Halogen': '#fb923c',
    'Actinide': '#f87171',
    'Lanthanide': '#c084fc',
    'Unknown': '#94a3b8',
  } as Record<string, string>,
};

export const getCategoryColor = (category: string): string => {
  return COLORS.category[category] || COLORS.category['Unknown'];
};

export const THEMES = {
  quantum: {
    name: 'Quantum Lab',
    bg: '#0a0e1a',
    primary: '#6366f1',
    accent: '#a78bfa',
    card: 'rgba(17, 24, 45, 0.75)',
  },
  cyberpunk: {
    name: 'Cyber Neon',
    bg: '#05050f',
    primary: '#ec4899',
    accent: '#06b6d4',
    card: 'rgba(236, 72, 153, 0.08)',
  },
  deepspace: {
    name: 'Deep Space',
    bg: '#020408',
    primary: '#38bdf8',
    accent: '#818cf8',
    card: 'rgba(56, 189, 248, 0.08)',
  },
};

export const SHADOWS = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  glow: {
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
