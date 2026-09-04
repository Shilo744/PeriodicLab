require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { WEEKLY_GOAL_TARGET, localWeekKey, normalizeWeeklyGoal, recordWeeklyAction } = require('../src/data/weeklyGoal.ts');

test('week keys start on Monday and survive the Sunday boundary', () => {
  assert.equal(localWeekKey(new Date(2026, 8, 7, 0, 1)), '2026-09-07');
  assert.equal(localWeekKey(new Date(2026, 8, 13, 23, 59)), '2026-09-07');
  assert.equal(localWeekKey(new Date(2026, 8, 14, 0, 1)), '2026-09-14');
});

test('weekly actions cap at the target and unlock one reward state', () => {
  const now = new Date(2026, 8, 7, 12);
  let goal = normalizeWeeklyGoal(null, now);
  for (let index = 0; index < WEEKLY_GOAL_TARGET + 3; index += 1) goal = recordWeeklyAction(goal, now);
  assert.equal(goal.actions, WEEKLY_GOAL_TARGET);
  assert.equal(goal.rewarded, true);
});

test('a new local week resets progress and repairs malformed values', () => {
  const previous = { weekKey: '2026-09-07', actions: 6, rewarded: false };
  assert.deepEqual(normalizeWeeklyGoal(previous, new Date(2026, 8, 14)), { weekKey: '2026-09-14', actions: 0, rewarded: false });
  assert.deepEqual(normalizeWeeklyGoal({ weekKey: '2026-09-14', actions: 999, rewarded: false }, new Date(2026, 8, 14)), { weekKey: '2026-09-14', actions: 7, rewarded: false });
});
