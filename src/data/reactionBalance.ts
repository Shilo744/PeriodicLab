import { ELEMENTS } from './elements';
import type { ChemicalReaction } from './reactions';

const symbols = new Set(ELEMENTS.map(el => el.sym));
export type AtomCounts = Record<string, number>;

/** Supports the simple, uncharged formulas used by the reference catalog. */
export function countFormulaAtoms(formula: string): AtomCounts {
  const text = formula.replace(/[₀-₉]/g, char => String('₀₁₂₃₄₅₆₇₈₉'.indexOf(char)));
  const counts: AtomCounts = {};
  const tokens = /([A-Z][a-z]?)(\d*)/g;
  let end = 0;
  let match: RegExpExecArray | null;
  while ((match = tokens.exec(text))) {
    if (match.index !== end || !symbols.has(match[1])) throw new Error(`Unsupported formula: ${formula}`);
    const count = match[2] ? Number(match[2]) : 1;
    if (!Number.isSafeInteger(count) || count < 1) throw new Error(`Invalid atom count: ${formula}`);
    counts[match[1]] = (counts[match[1]] || 0) + count;
    end = tokens.lastIndex;
  }
  if (!end || end !== text.length) throw new Error(`Unsupported formula: ${formula}`);
  return counts;
}

function countSide(side: ChemicalReaction['reactants']): AtomCounts {
  if (!side.length) throw new Error('Empty reaction side');
  const counts: AtomCounts = {};
  for (const item of side) {
    if (!Number.isSafeInteger(item.count) || item.count < 1) throw new Error('Invalid coefficient');
    for (const [symbol, count] of Object.entries(countFormulaAtoms(item.formula))) {
      const total = (counts[symbol] || 0) + count * item.count;
      if (!Number.isSafeInteger(total)) throw new Error('Atom count overflow');
      counts[symbol] = total;
    }
  }
  return counts;
}

export function reactionBalance(reaction: Pick<ChemicalReaction, 'reactants' | 'products'>) {
  const left = countSide(reaction.reactants);
  const right = countSide(reaction.products);
  const rows = [...new Set([...Object.keys(left), ...Object.keys(right)])].sort().map(symbol => ({
    symbol, reactants: left[symbol] || 0, products: right[symbol] || 0,
  }));
  return { balanced: rows.every(row => row.reactants === row.products), rows };
}
