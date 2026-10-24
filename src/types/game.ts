export type Difficulty = 'easy' | 'normal' | 'hard';

export interface MythosEntity {
  id: string;
  name: string;
  title: string;
  quote: string;
  source: string;
  color: string;
  iconType: string;
}

export interface CardItem {
  instanceId: string;
  entityId: string;
  entity: MythosEntity;
  isFlipped: boolean;
  isMatched: boolean;
  isMismatching?: boolean;
}

export interface DifficultyConfig {
  name: string;
  label: string;
  cardsCount: number;
  pairsCount: number;
  gridCols: string;
  sanityDrainOnMismatch: number;
  sanityRecoveryOnMatch: number;
}

export interface GameStats {
  moves: number;
  timeElapsed: number;
  sanity: number;
  matchedPairs: number;
  totalPairs: number;
}

export interface BestScore {
  moves: number;
  time: number;
  date: string;
}
