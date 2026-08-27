require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { shuffled, randomAlternative } = require('../src/utils/random.ts');
test('shuffle preserves input and all items including duplicates', () => {
  const source = Object.freeze([1, 2, 2, 3]);
  const result = shuffled(source, () => 0);
  assert.deepEqual(source, [1, 2, 2, 3]);
  assert.deepEqual([...result].sort(), [...source]);
  assert.notDeepEqual(result, source);
});
test('random alternative respects candidates, avoids repetition and handles empty filters', () => {
  assert.equal(randomAlternative([1, 2, 3], 2, () => 0), 1);
  assert.equal(randomAlternative([1, 2, 3], 2, () => 0.99), 3);
  assert.equal(randomAlternative([2], 2), 2);
  assert.equal(randomAlternative([], 2), undefined);
});
test('shuffle handles empty and single-card decks', () => {
  assert.deepEqual(shuffled([]), []);
  assert.deepEqual(shuffled([1]), [1]);
});
