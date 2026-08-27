import type { ChemicalReaction } from './reactions';

export function normalizeFormulaSearch(value: string): string {
  return value.replace(/[₀-₉]/g, digit => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(digit))).trim().toLowerCase();
}

export function matchesReactionQuery(reaction: ChemicalReaction, query: string): boolean {
  const words = normalizeFormulaSearch(query).split(/\s+/).filter(Boolean);
  const searchable = normalizeFormulaSearch([
    reaction.name, reaction.nameHe, reaction.equation, reaction.description, reaction.type,
    ...reaction.reactants.map(item => `${item.formula} ${item.name}`),
    ...reaction.products.map(item => `${item.formula} ${item.name}`),
  ].join(' '));
  return words.every(word => searchable.includes(word));
}
