import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDeck,
  updateSanity,
  isSanityDepleted,
  isRitualComplete,
  getInvestigatorRank,
} from '../src/utils/gameLogic.ts';
import { DIFFICULTY_CONFIGS } from '../src/data/lovecraftCards.ts';

test('createDeck generates correct count of cards for all difficulties', () => {
  const easyDeck = createDeck('easy');
  assert.equal(easyDeck.length, 12);
  assert.equal(new Set(easyDeck.map((c) => c.entityId)).size, 6);

  const normalDeck = createDeck('normal');
  assert.equal(normalDeck.length, 16);
  assert.equal(new Set(normalDeck.map((c) => c.entityId)).size, 8);

  const hardDeck = createDeck('hard');
  assert.equal(hardDeck.length, 24);
  assert.equal(new Set(hardDeck.map((c) => c.entityId)).size, 12);
});

test('createDeck creates matching pairs for every card', () => {
  const deck = createDeck('normal');
  const entityCounts: Record<string, number> = {};
  for (const card of deck) {
    entityCounts[card.entityId] = (entityCounts[card.entityId] || 0) + 1;
  }
  for (const count of Object.values(entityCounts)) {
    assert.equal(count, 2, 'Every entity must appear exactly twice');
  }
});

test('updateSanity drains on mismatch and clamps at 0', () => {
  const initial = 20;
  const drain = 25;
  const result = updateSanity(initial, false, drain, 5);
  assert.equal(result, 0);
  assert.equal(isSanityDepleted(result), true);
});

test('updateSanity recovers on match and clamps at 100', () => {
  const initial = 98;
  const result = updateSanity(initial, true, 10, 5);
  assert.equal(result, 100);
});

test('isRitualComplete triggers only when all pairs are matched', () => {
  assert.equal(isRitualComplete(7, 8), false);
  assert.equal(isRitualComplete(8, 8), true);
  assert.equal(isRitualComplete(9, 8), true);
});

test('getInvestigatorRank assigns appropriate rank based on sanity', () => {
  assert.match(getInvestigatorRank(90), /Hermética/);
  assert.match(getInvestigatorRank(60), /Sobreviviente/);
  assert.match(getInvestigatorRank(30), /Penumbra/);
  assert.match(getInvestigatorRank(0), /Vorágine/);
});
