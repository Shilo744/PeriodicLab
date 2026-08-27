require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { recordReview, nextReviewIndex } = require('../src/data/flashcards.ts');
test('self-assessment is idempotent and can mark a known card for review', () => {
  const original = [1, 2];
  assert.deepEqual(recordReview(original, 2, true), original);
  assert.deepEqual(recordReview(original, 3, true), [1, 2, 3]);
  assert.deepEqual(recordReview(original, 2, false), [1]);
  assert.deepEqual(original, [1, 2]);
});
test('review navigation does not skip the next card after removal', () => {
  assert.equal(nextReviewIndex([1, 2, 3], [2, 3], 0), 0);
  assert.equal(nextReviewIndex([1, 2, 3], [1, 3], 1), 1);
  assert.equal(nextReviewIndex([1, 2, 3], [1, 2], 2), 0);
  assert.equal(nextReviewIndex([1, 2], [1, 2], 0), 1);
  assert.equal(nextReviewIndex([1], [], 0), 0);
});
