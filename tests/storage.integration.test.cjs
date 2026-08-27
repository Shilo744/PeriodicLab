require('./load-ts.cjs');
const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

// Only the native storage adapter is stubbed; exercise the real exported API.
const disk = new Map([
  ['periodic_lab_xp', '125'],
  ['periodic_lab_levels', '{"1":2,"2":-1,"119":4}'],
  ['periodic_lab_pool', '[]'],
  ['periodic_lab_last_element', '999'],
  ['periodic_lab_last_tab', 'study'],
  ['periodic_lab_flashcards', '[2,2,10,null,999]'],
  ['periodic_lab_preferences', '{"locale":"he","audioMuted":true}'],
]);
const adapter = { getItem: async key => disk.get(key) ?? null, setItem: async (key, value) => { disk.set(key, value); } };
const originalLoad = Module._load;
let storage;
try {
  Module._load = function (request, ...args) {
    if (request === '@react-native-async-storage/async-storage') return { default: adapter };
    return originalLoad.call(this, request, ...args);
  };
  storage = require('../src/data/storage.ts');
} finally { Module._load = originalLoad; }

test('public restore API preserves legacy progress and repairs unsafe selections', async () => {
  assert.equal(await storage.loadXP(), 125);
  assert.deepEqual(await storage.loadLevels(), { 1: 2, 2: 0 });
  assert.deepEqual(await storage.loadStudyPool([1, 2, 3]), [1, 2, 3]);
  assert.equal(await storage.loadLastElement(), 6);
  assert.equal(await storage.loadLastTab(), 'study');
  assert.deepEqual(await storage.loadMasteredFlashcards(), [2, 10]);
  assert.deepEqual(await storage.loadPreferences(), { locale: 'he', audioMuted: true });
});

test('public preferences API merges rapid edits and persists a selected element', async () => {
  await Promise.all([storage.savePreferences({ locale: 'en' }), storage.savePreferences({ audioMuted: false })]);
  assert.deepEqual(await storage.loadPreferences(), { locale: 'en', audioMuted: false });
  await storage.saveLastElement(7);
  assert.equal(await storage.loadLastElement(), 7);
  assert.equal(JSON.parse(disk.get('periodic_lab_last_element')), 7);
});
