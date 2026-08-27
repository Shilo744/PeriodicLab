/** Self-assessment records practice, not quiz XP or discovery rewards. */
export function recordReview(mastered: readonly number[], z: number, known: boolean): number[] {
  const unique = [...new Set(mastered)];
  return known ? (unique.includes(z) ? unique : [...unique, z]) : unique.filter(id => id !== z);
}
