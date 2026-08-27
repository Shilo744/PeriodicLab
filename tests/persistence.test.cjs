require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const { createPersistence } = require('../src/data/persistence.ts');
const schema = require('../src/data/storageSchema.ts');
function backend(initial = {}) {
  const values = new Map(Object.entries(initial));
  return { values, getItem: async key => values.get(key) ?? null, setItem: async (key, value) => { values.set(key, value); } };
}
test('storage normalizes legacy strings and malformed JSON', async () => {
  const store = createPersistence(backend({ tab: 'study', broken: '{bad', ids: '[1,1,119,-1,2,"3"]' }));
  assert.equal(await store.read('tab', String), 'study');
  assert.deepEqual(await store.read('broken', schema.preferences), { locale: 'en', audioMuted: false });
  assert.deepEqual(await store.read('ids', schema.elementIds), [1, 2]);
});
test('concurrent settings updates preserve unrelated fields', async () => {
  const disk = backend();
  const store = createPersistence(disk);
  await Promise.all([
    store.update('prefs', schema.preferences, prev => ({ ...prev, locale: 'he' })),
    store.update('prefs', schema.preferences, prev => ({ ...prev, audioMuted: true })),
  ]);
  assert.deepEqual(await store.read('prefs', schema.preferences), { locale: 'he', audioMuted: true });
});
test('failed writes remain readable even when the backend has stale data', async () => {
  const disk = backend({ xp: '1' });
  disk.setItem = async () => { throw new Error('unavailable'); };
  const store = createPersistence(disk);
  await store.write('xp', 40);
  assert.equal(await store.read('xp', schema.nonnegativeInteger), 40);
});
test('reads await ordered writes to the same key', async () => {
  const store = createPersistence(backend());
  const first = store.write('xp', 5);
  const second = store.write('xp', 10);
  assert.equal(await store.read('xp', schema.nonnegativeInteger), 10);
  await Promise.all([first, second]);
});
test('progress schema rejects invalid ids, settings, and non-finite numbers', () => {
  assert.deepEqual(schema.levelsRecord({ 1: 2, 2: -3, 119: 5, x: 7 }), { 1: 2, 2: 0 });
  assert.deepEqual(schema.preferences({ locale: 'xx', audioMuted: 'false' }), { locale: 'en', audioMuted: false });
  assert.equal(schema.nonnegativeInteger(Infinity), 0);
  assert.equal(schema.nonnegativeInteger(1.5), 0);
  assert.deepEqual(schema.stringIds(['water', 2, 'water', null, '']), ['water']);
});
