require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { advanceDailyStreak, normalizeStreak, localDateKey } = require('../src/data/dailyStreak.ts');
const { getDailyFeaturedElement } = require('../src/data/achievements.ts');
const { createPersistence } = require('../src/data/persistence.ts');
test('daily featured element follows the local calendar date', () => {
  const early = getDailyFeaturedElement(new Date(2026, 8, 1, 0, 1));
  const late = getDailyFeaturedElement(new Date(2026, 8, 1, 23, 59));
  assert.deepEqual(early, late);
  assert.equal(late.dateStr, '2026-09-01');
  assert.ok(late.z >= 1 && late.z <= 118);
});
test('first visit starts at one even just after local midnight', () => {
  const now = new Date(2026, 7, 27, 0, 5);
  assert.deepEqual(advanceDailyStreak(normalizeStreak(null), now), { streak: 1, lastDate: '2026-08-27' });
  assert.equal(localDateKey(now), '2026-08-27');
});
test('same day is idempotent; consecutive calendar days increment', () => {
  assert.deepEqual(advanceDailyStreak({ streak: 4, lastDate: '2026-08-27' }, new Date(2026, 7, 27, 23)), { streak: 4, lastDate: '2026-08-27' });
  assert.equal(advanceDailyStreak({ streak: 4, lastDate: '2026-08-26' }, new Date(2026, 7, 27)).streak, 5);
});
test('year and leap-day boundaries preserve the streak', () => {
  assert.equal(advanceDailyStreak({ streak: 3, lastDate: '2025-12-31' }, new Date(2026, 0, 1)).streak, 4);
  assert.equal(advanceDailyStreak({ streak: 3, lastDate: '2024-02-29' }, new Date(2024, 2, 1)).streak, 4);
});
test('missed days, future dates, and impossible dates reset safely', () => {
  for (const lastDate of ['2026-08-20', '2099-01-01', '2026-02-31', 'bad']) {
    assert.equal(advanceDailyStreak({ streak: 3, lastDate }, new Date(2026, 7, 27)).streak, 1);
  }
});
test('concurrent daily completions persist the first day once', async () => {
  let raw = null;
  const store = createPersistence({ getItem: async () => raw, setItem: async (_, value) => { raw = value; } });
  const now = new Date(2026, 7, 27);
  const visits = await Promise.all(Array.from({ length: 3 }, () => store.update('daily', normalizeStreak, saved => advanceDailyStreak(saved, now))));
  assert.ok(visits.every(value => value.streak === 1));
  assert.equal(JSON.parse(raw).lastDate, '2026-08-27');
});
