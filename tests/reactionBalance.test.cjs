require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { countFormulaAtoms, reactionBalance } = require('../src/data/reactionBalance.ts');
const { REACTIONS } = require('../src/data/reactions.ts');
test('formula parser counts repeated symbols and unicode digits', () => {
  assert.deepEqual(countFormulaAtoms('C2H5OH'), { C: 2, H: 6, O: 1 });
  assert.deepEqual(countFormulaAtoms('C₆H₁₂O₆'), { C: 6, H: 12, O: 6 });
});
test('unsupported formulas and invalid counts are not silently accepted', () => {
  for (const formula of ['', '2H2O', 'H0', 'Xx2', 'Ca(OH)2', 'H2O!', 'H-1']) assert.throws(() => countFormulaAtoms(formula), formula);
});
test('every catalog reaction conserves each element', () => {
  for (const reaction of REACTIONS) assert.equal(reactionBalance(reaction).balanced, true, reaction.id);
});
test('conservation check catches missing or wrong coefficients', () => {
  const water = REACTIONS.find(r => r.id === 'water_synthesis');
  assert.equal(reactionBalance({ ...water, products: [{ ...water.products[0], count: 1 }] }).balanced, false);
  assert.throws(() => reactionBalance({ ...water, products: [] }));
});
