/** Fisher–Yates: each permutation has equal probability; never mutates input. */
export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function randomAlternative<T>(items: readonly T[], current: T | undefined, random: () => number = Math.random): T | undefined {
  const others = items.filter(item => item !== current);
  const candidates = others.length ? others : items;
  return candidates.length ? candidates[Math.floor(random() * candidates.length)] : undefined;
}
