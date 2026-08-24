export interface ChemicalReaction {
  id: string;
  name: string;
  nameHe: string;
  equation: string;
  reactants: { formula: string; count: number; name: string }[];
  products: { formula: string; count: number; name: string }[];
  type: 'combustion' | 'synthesis' | 'neutralization' | 'redox';
  enthalpy: string; // e.g. "Exothermic (ΔH = -890 kJ/mol)"
  description: string;
  xpReward: number;
}

export const REACTIONS: ChemicalReaction[] = [
  {
    id: 'water_synthesis',
    name: 'Hydrogen Combustion (Water Synthesis)',
    nameHe: 'שריפת מימן (סינתוז מים)',
    equation: '2H₂ + O₂ ➔ 2H₂O',
    reactants: [
      { formula: 'H₂', count: 2, name: 'Hydrogen Gas' },
      { formula: 'O₂', count: 1, name: 'Oxygen Gas' },
    ],
    products: [
      { formula: 'H₂O', count: 2, name: 'Water Vapor' },
    ],
    type: 'combustion',
    enthalpy: 'Exothermic (ΔH = -572 kJ/mol)',
    description: 'Explosive rocket fuel reaction producing clean water and immense heat energy.',
    xpReward: 80,
  },
  {
    id: 'methane_combustion',
    name: 'Methane Combustion',
    nameHe: 'שריפת מתאן',
    equation: 'CH₄ + 2O₂ ➔ CO₂ + 2H₂O',
    reactants: [
      { formula: 'CH₄', count: 1, name: 'Methane' },
      { formula: 'O₂', count: 2, name: 'Oxygen Gas' },
    ],
    products: [
      { formula: 'CO₂', count: 1, name: 'Carbon Dioxide' },
      { formula: 'H₂O', count: 2, name: 'Water Vapor' },
    ],
    type: 'combustion',
    enthalpy: 'Exothermic (ΔH = -891 kJ/mol)',
    description: 'Primary reaction in natural gas heaters and gas turbine power generation.',
    xpReward: 90,
  },
  {
    id: 'salt_formation',
    name: 'Sodium Chloride Redox Synthesis',
    nameHe: 'סינתוז מלח שולחן (חיזור-חמצון)',
    equation: '2Na + Cl₂ ➔ 2NaCl',
    reactants: [
      { formula: 'Na', count: 2, name: 'Sodium Metal' },
      { formula: 'Cl₂', count: 1, name: 'Chlorine Gas' },
    ],
    products: [
      { formula: 'NaCl', count: 2, name: 'Sodium Chloride' },
    ],
    type: 'redox',
    enthalpy: 'Exothermic (ΔH = -822 kJ/mol)',
    description: 'Violent reaction between reactive soft metal and toxic gas creating edible salt.',
    xpReward: 100,
  },
  {
    id: 'haber_bosch',
    name: 'Haber-Bosch Ammonia Synthesis',
    nameHe: 'תהליך הבר-בוש לייצור אמוניה',
    equation: 'N₂ + 3H₂ ➔ 2NH₃',
    reactants: [
      { formula: 'N₂', count: 1, name: 'Nitrogen Gas' },
      { formula: 'H₂', count: 3, name: 'Hydrogen Gas' },
    ],
    products: [
      { formula: 'NH₃', count: 2, name: 'Ammonia' },
    ],
    type: 'synthesis',
    enthalpy: 'Exothermic (ΔH = -92 kJ/mol)',
    description: 'Nobel prize winning industrial process feeding billions through fertilizer synthesis.',
    xpReward: 110,
  },
  {
    id: 'photosynthesis',
    name: 'Photosynthesis (Glucose Generation)',
    nameHe: 'פוטוסינתזה (יצירת סוכר)',
    equation: '6CO₂ + 6H₂O ➔ C₆H₁₂O₆ + 6O₂',
    reactants: [
      { formula: 'CO₂', count: 6, name: 'Carbon Dioxide' },
      { formula: 'H₂O', count: 6, name: 'Water' },
    ],
    products: [
      { formula: 'C₆H₁₂O₆', count: 1, name: 'Glucose' },
      { formula: 'O₂', count: 6, name: 'Oxygen' },
    ],
    type: 'synthesis',
    enthalpy: 'Endothermic (Solar Energy Captured)',
    description: 'Fundamental bio-energetic engine of planet Earth producing oxygen and carbohydrates.',
    xpReward: 150,
  },
];
