export interface Compound {
  id: string;
  name: string;
  nameHe: string;
  formula: string;
  recipe: Record<number, number>; // Z -> quantity
  bondType: 'covalent' | 'ionic' | 'polar_covalent';
  desc: string;
  xpReward: number;
}

export const COMPOUNDS: Compound[] = [
  {
    id: 'water',
    name: 'Water',
    nameHe: 'מים',
    formula: 'H₂O',
    recipe: { 1: 2, 8: 1 }, // 2 H + 1 O
    bondType: 'polar_covalent',
    desc: 'The universal solvent and essential molecule for all known terrestrial life.',
    xpReward: 60,
  },
  {
    id: 'carbon_dioxide',
    name: 'Carbon Dioxide',
    nameHe: 'פחמן דו-חמצני',
    formula: 'CO₂',
    recipe: { 6: 1, 8: 2 }, // 1 C + 2 O
    bondType: 'covalent',
    desc: 'Greenhouse gas consumed by plants during photosynthesis and exhaled by animals.',
    xpReward: 60,
  },
  {
    id: 'table_salt',
    name: 'Sodium Chloride (Table Salt)',
    nameHe: 'מלח שולחן (נתרן כלורי)',
    formula: 'NaCl',
    recipe: { 11: 1, 17: 1 }, // 1 Na + 1 Cl
    bondType: 'ionic',
    desc: 'Classic crystal ionic lattice compound essential for biological electrolyte balance.',
    xpReward: 70,
  },
  {
    id: 'methane',
    name: 'Methane',
    nameHe: 'מתאן',
    formula: 'CH₄',
    recipe: { 6: 1, 1: 4 }, // 1 C + 4 H
    bondType: 'covalent',
    desc: 'Simplest alkane and primary component of natural gas with tetrahedral geometry.',
    xpReward: 65,
  },
  {
    id: 'ammonia',
    name: 'Ammonia',
    nameHe: 'אמוניה',
    formula: 'NH₃',
    recipe: { 7: 1, 1: 3 }, // 1 N + 3 H
    bondType: 'polar_covalent',
    desc: 'Pungent nitrogen compound critical in synthetic agricultural fertilizers.',
    xpReward: 75,
  },
  {
    id: 'hydrochloric_acid',
    name: 'Hydrochloric Acid',
    nameHe: 'חומצת מימן כלורי',
    formula: 'HCl',
    recipe: { 1: 1, 17: 1 }, // 1 H + 1 Cl
    bondType: 'polar_covalent',
    desc: 'Strong mineral acid and key component of mammalian gastric acid for digestion.',
    xpReward: 70,
  },
  {
    id: 'rust',
    name: 'Iron(III) Oxide (Rust)',
    nameHe: 'תחמוצת ברזל (חלודה)',
    formula: 'Fe₂O₃',
    recipe: { 26: 2, 8: 3 }, // 2 Fe + 3 O
    bondType: 'ionic',
    desc: 'Reddish-brown inorganic compound formed by the oxidation of iron in moisture.',
    xpReward: 90,
  },
  {
    id: 'ethanol',
    name: 'Ethanol',
    nameHe: 'אתנול',
    formula: 'C₂H₅OH',
    recipe: { 6: 2, 1: 6, 8: 1 }, // 2 C + 6 H + 1 O
    bondType: 'covalent',
    desc: 'Volatile, flammable alcohol used as a solvent, antiseptic, and biofuel.',
    xpReward: 100,
  },
];

export function findMatchingCompound(counts: Record<number, number>): Compound | null {
  for (const cmp of COMPOUNDS) {
    const recipeKeys = Object.keys(cmp.recipe).map(Number);
    const countKeys = Object.keys(counts).map(Number).filter(k => (counts[k] || 0) > 0);

    if (recipeKeys.length !== countKeys.length) continue;

    const matches = recipeKeys.every(z => (counts[z] || 0) === cmp.recipe[z]);
    if (matches) return cmp;
  }
  return null;
}
