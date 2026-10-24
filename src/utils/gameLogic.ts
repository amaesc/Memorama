import { Difficulty, CardItem, MythosEntity } from '../types/game';
import { DIFFICULTY_CONFIGS, MYTHOS_ENTITIES } from '../data/lovecraftCards';

export function createDeck(difficulty: Difficulty, entities: MythosEntity[] = MYTHOS_ENTITIES): CardItem[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const shuffledEntities = [...entities].sort(() => Math.random() - 0.5);
  const selectedEntities = shuffledEntities.slice(0, config.pairsCount);

  const deck: CardItem[] = [];
  selectedEntities.forEach((entity, index) => {
    deck.push({
      instanceId: `${entity.id}_a_${index}`,
      entityId: entity.id,
      entity,
      isFlipped: false,
      isMatched: false,
    });
    deck.push({
      instanceId: `${entity.id}_b_${index}`,
      entityId: entity.id,
      entity,
      isFlipped: false,
      isMatched: false,
    });
  });

  return deck.sort(() => Math.random() - 0.5);
}

export function updateSanity(
  currentSanity: number,
  isMatch: boolean,
  drainAmount: number,
  recoveryAmount: number
): number {
  if (isMatch) {
    return Math.min(100, Math.max(0, currentSanity + recoveryAmount));
  }
  return Math.max(0, currentSanity - drainAmount);
}

export function isSanityDepleted(sanity: number): boolean {
  return sanity <= 0;
}

export function isRitualComplete(matchedPairs: number, totalPairs: number): boolean {
  return matchedPairs >= totalPairs;
}

export function getInvestigatorRank(sanity: number): string {
  if (sanity >= 80) return 'Gran Erudito de la Logia Hermética';
  if (sanity >= 50) return 'Investigador de Arkham Sobreviviente';
  if (sanity > 0) return 'Navegante de la Penumbra Alucinada';
  return 'Alma Atrapada en la Vorágine';
}
