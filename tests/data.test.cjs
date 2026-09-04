require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { ELEMENTS, getElement } = require('../src/data/elements.ts');
const { REACTIONS } = require('../src/data/reactions.ts');
const { validateScientificData } = require('../src/data/validation.ts');
const { QUIZZES } = require('../src/data/quiz.ts');
const { ACHIEVEMENTS_LIST, CHAPTERS, getAchievement, getNextChapterElement } = require('../src/data/achievements.ts');
const { getDailyChallenge } = require('../src/data/dailyChallenge.ts');

test('catalog contains every atomic number exactly once', () => {
  assert.deepEqual(ELEMENTS.map(e => e.z).sort((a, b) => a - b), Array.from({ length: 118 }, (_, i) => i + 1));
  assert.equal(new Set(ELEMENTS.map(e => e.sym)).size, 118);
  for (const el of ELEMENTS) assert.equal(getElement(el.z).sym, el.sym);
});

test('reactions have unique ids and positive integral coefficients', () => {
  assert.equal(new Set(REACTIONS.map(r => r.id)).size, REACTIONS.length);
  for (const r of REACTIONS) {
    assert.ok(r.reactants.length && r.products.length, r.id);
    for (const side of [...r.reactants, ...r.products]) assert.ok(Number.isInteger(side.count) && side.count > 0, r.id);
  }
});

test('the full scientific catalog passes startup validation', () => {
  const result = validateScientificData();
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.deepEqual(result.errors, []);
});

test('quiz library has deep coverage and valid category filters', () => {
  const categories = new Set(QUIZZES.map(question => question.category));
  assert.ok(QUIZZES.length >= 40);
  for (const category of ['structure', 'groups', 'trends', 'bonding', 'reactions', 'applications', 'history', 'superheavy']) assert.ok(categories.has(category), category);
  assert.equal(new Set(QUIZZES.map(question => question.id)).size, QUIZZES.length);
});

test('achievement catalog has unique ids and event-driven rewards', () => {
  assert.equal(new Set(ACHIEVEMENTS_LIST.map(item => item.id)).size, ACHIEVEMENTS_LIST.length);
  for (const id of ['fusion_pioneer', 'streak_master']) {
    const achievement = getAchievement(id);
    assert.ok(achievement, id);
    assert.ok(achievement.xpReward > 0, id);
  }
});

test('chapters cover the full table once and resume the next unmastered element', () => {
  const chapterElements = CHAPTERS.flatMap(chapter => chapter.elements);
  assert.deepEqual(chapterElements, Array.from({ length: 118 }, (_, index) => index + 1));
  assert.equal(new Set(chapterElements).size, 118);
  assert.equal(getNextChapterElement(CHAPTERS[0], { 1: 2, 2: 2, 3: 1 }), 3);
  assert.equal(getNextChapterElement(CHAPTERS[0], Object.fromEntries(CHAPTERS[0].elements.map(z => [z, 2]))), 1);
});

test('daily recall is deterministic, valid, and changes with the local day', () => {
  const today = getDailyChallenge(new Date(2026, 7, 25, 0, 5));
  const repeated = getDailyChallenge(new Date(2026, 7, 25, 23, 55));
  const tomorrow = getDailyChallenge(new Date(2026, 7, 26, 0, 5));
  assert.deepEqual(today, repeated);
  assert.notEqual(today.dateStr, tomorrow.dateStr);
  assert.equal(today.options.length, 4);
  assert.equal(new Set(today.options).size, 4);
  const element = getElement(today.z);
  const expected = today.kind === 'atomic-number' ? String(today.z)
    : today.kind === 'category' ? element.category
      : today.kind === 'state' ? element.state
        : String(element.shells.at(-1));
  assert.equal(today.options[today.correctIndex], expected);
  assert.ok(today.explanation.length > 40);
});

test('daily recall rotates through every science prompt with one valid answer', () => {
  const kinds = new Set();
  for (let day = 1; day <= 20; day += 1) {
    const challenge = getDailyChallenge(new Date(2026, 8, day, 12));
    kinds.add(challenge.kind);
    assert.equal(challenge.options.length, 4);
    assert.equal(new Set(challenge.options).size, 4);
    assert.ok(challenge.correctIndex >= 0 && challenge.correctIndex < 4);
    assert.ok(challenge.options[challenge.correctIndex]);
  }
  assert.deepEqual([...kinds].sort(), ['atomic-number', 'category', 'state', 'valence-electrons']);
});
