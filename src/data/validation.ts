import { ELEMENTS } from './elements';
import { REACTIONS } from './reactions';
import { reactionBalance } from './reactionBalance';
import { QUIZZES } from './quiz';

export interface DataValidationResult { valid: boolean; errors: string[]; }

export function validateScientificData(): DataValidationResult {
  const errors: string[] = [];
  const atomicNumbers = new Set<number>();
  const symbols = new Set<string>();
  for (const element of ELEMENTS) {
    if (atomicNumbers.has(element.z)) errors.push(`Duplicate atomic number: ${element.z}`);
    atomicNumbers.add(element.z);
    if (symbols.has(element.sym)) errors.push(`Duplicate element symbol: ${element.sym}`);
    symbols.add(element.sym);
    if (element.shells.reduce((sum, count) => sum + count, 0) !== element.z) errors.push(`${element.sym}: electron shells do not total Z`);
    if (element.mass <= 0) errors.push(`${element.sym}: atomic mass must be positive`);
    if (element.density !== undefined && element.density <= 0) errors.push(`${element.sym}: density must be positive`);
    if (element.atomicRadius !== undefined && element.atomicRadius <= 0) errors.push(`${element.sym}: atomic radius must be positive`);
    if (element.ionizationEnergy !== undefined && element.ionizationEnergy <= 0) errors.push(`${element.sym}: ionization energy must be positive`);
  }
  if (ELEMENTS.length !== 118) errors.push(`Expected 118 elements, found ${ELEMENTS.length}`);
  for (let z = 1; z <= 118; z += 1) if (!atomicNumbers.has(z)) errors.push(`Missing atomic number: ${z}`);

  const reactionIds = new Set<string>();
  for (const reaction of REACTIONS) {
    try {
      if (!reactionBalance(reaction).balanced) errors.push(`${reaction.id}: atoms are not conserved`);
    } catch (error) { errors.push(`${reaction.id}: ${String(error)}`); }
    if (reactionIds.has(reaction.id)) errors.push(`Duplicate reaction id: ${reaction.id}`);
    reactionIds.add(reaction.id);
    if (!reaction.equation.includes('➔')) errors.push(`${reaction.id}: equation is missing an arrow`);
    if (!reaction.reactants.length || !reaction.products.length) errors.push(`${reaction.id}: reaction sides cannot be empty`);
    if ([...reaction.reactants, ...reaction.products].some(item => item.count <= 0)) errors.push(`${reaction.id}: stoichiometric coefficients must be positive`);
    if (reaction.xpReward <= 0) errors.push(`${reaction.id}: XP reward must be positive`);
  }
  const questionIds = new Set<number>();
  for (const question of QUIZZES) {
    if (questionIds.has(question.id)) errors.push(`Duplicate quiz question id: ${question.id}`);
    questionIds.add(question.id);
    if (question.options.length !== 4) errors.push(`Question ${question.id}: expected four options`);
    if (question.correctIndex < 0 || question.correctIndex >= question.options.length) errors.push(`Question ${question.id}: invalid correct answer`);
    if (!question.question.trim() || !question.explanation.trim()) errors.push(`Question ${question.id}: missing educational content`);
    if (question.difficulty < 1 || question.difficulty > 5 || question.rewardPoints <= 0) errors.push(`Question ${question.id}: invalid difficulty or reward`);
  }
  return { valid: errors.length === 0, errors };
}
