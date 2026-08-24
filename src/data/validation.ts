import { ELEMENTS } from './elements';
import { REACTIONS } from './reactions';

export interface DataValidationResult { valid: boolean; errors: string[]; }

export function validateScientificData(): DataValidationResult {
  const errors: string[] = [];
  const atomicNumbers = new Set<number>();
  for (const element of ELEMENTS) {
    if (atomicNumbers.has(element.z)) errors.push(`Duplicate atomic number: ${element.z}`);
    atomicNumbers.add(element.z);
    if (element.shells.reduce((sum, count) => sum + count, 0) !== element.z) errors.push(`${element.sym}: electron shells do not total Z`);
    if (element.mass <= 0) errors.push(`${element.sym}: atomic mass must be positive`);
  }
  if (ELEMENTS.length !== 118) errors.push(`Expected 118 elements, found ${ELEMENTS.length}`);

  const reactionIds = new Set<string>();
  for (const reaction of REACTIONS) {
    if (reactionIds.has(reaction.id)) errors.push(`Duplicate reaction id: ${reaction.id}`);
    reactionIds.add(reaction.id);
    if (!reaction.equation.includes('➔')) errors.push(`${reaction.id}: equation is missing an arrow`);
    if (!reaction.reactants.length || !reaction.products.length) errors.push(`${reaction.id}: reaction sides cannot be empty`);
  }
  return { valid: errors.length === 0, errors };
}
