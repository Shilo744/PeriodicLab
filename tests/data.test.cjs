require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { ELEMENTS, getElement } = require('../src/data/elements.ts');
const { REACTIONS } = require('../src/data/reactions.ts');
const { validateScientificData } = require('../src/data/validation.ts');
const { QUIZZES } = require('../src/data/quiz.ts');
const { ACHIEVEMENTS_LIST, getAchievement } = require('../src/data/achievements.ts');

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
