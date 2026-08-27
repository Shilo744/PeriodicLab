/** Self-assessment records practice, not quiz XP or discovery rewards. */
export function recordReview(mastered: readonly number[], z: number, known: boolean): number[] {
  const unique = [...new Set(mastered)];
  return known ? (unique.includes(z) ? unique : [...unique, z]) : unique.filter(id => id !== z);
}

export function nextReviewIndex(before: readonly number[], after: readonly number[], index: number): number {
  if (!before.length || !after.length) return 0;
  for (let step = 1; step <= before.length; step++) {
    const next = after.indexOf(before[(index + step) % before.length]);
    if (next !== -1) return next;
  }
  return 0;
}
