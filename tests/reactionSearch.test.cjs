require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { matchesReactionQuery, normalizeFormulaSearch } = require('../src/data/reactionSearch.ts');
const { REACTIONS } = require('../src/data/reactions.ts');
const water = REACTIONS.find(r => r.id === 'water_synthesis');
test('reaction search accepts plain digits and unicode subscripts', () => {
  assert.equal(normalizeFormulaSearch(' H₂O '), 'h2o');
  for (const q of ['H2O', 'H₂O', ' hydrogen WATER ', 'שריפת מימן', 'Water Vapor', '   ']) {
    assert.equal(matchesReactionQuery(water, q), true, q);
  }
  assert.equal(matchesReactionQuery(water, 'NaOH'), false);
});
