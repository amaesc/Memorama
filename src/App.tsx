import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, CardItem, GameStats, BestScore, MythosEntity } from './types/game';
import { DIFFICULTY_CONFIGS, MYTHOS_ENTITIES } from './data/lovecraftCards';
import {
  createDeck,
  updateSanity,
  isSanityDepleted,
  isRitualComplete,
  getInvestigatorRank,
} from './utils/gameLogic';
import { soundEngine } from './utils/audio';
import { IntroSplash } from './components/IntroSplash';
import { GameHUD } from './components/GameHUD';
import { SanityBar } from './components/SanityBar';
import { MemoryCard } from './components/MemoryCard';
import { LoreModal } from './components/LoreModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { MemoryScene3D } from './components/3d/MemoryScene3D';
import { ModelViewer3D } from './components/3d/ModelViewer3D';
import { BookOpen, Sparkles, AlertCircle, Box } from 'lucide-react';

const STORAGE_KEY = 'lovecraft_memory_records_v1';

export default function App() {
  const [phase, setPhase] = useState<'splash' | 'playing' | 'victory' | 'game_over'>('splash');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedCards, setFlippedCards] = useState<CardItem[]>([]);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [sanity, setSanity] = useState<number>(100);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [discoveredEntityIds, setDiscoveredEntityIds] = useState<Set<string>>(new Set());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoreOpen, setIsLoreOpen] = useState<boolean>(false);
  const [inspectEntity, setInspectEntity] = useState<MythosEntity | null>(null);
  const [inspect3DEntity, setInspect3DEntity] = useState<MythosEntity | null>(null);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [isPS2Filter, setIsPS2Filter] = useState<boolean>(true);
  const [recentQuote, setRecentQuote] = useState<{ name: string; quote: string } | null>(null);
  const [screenPulse, setScreenPulse] = useState<boolean>(false);

  // Best scores
  const [bestScores, setBestScores] = useState<Record<Difficulty, BestScore | null>>({
    easy: null,
    normal: null,
    hard: null,
  });

  // Load saved records
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setBestScores(JSON.parse(saved));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Timer loop
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (phase === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase]);

  // Update sanity audio drone/whispers
  useEffect(() => {
    soundEngine.updateSanityAudio(sanity);
  }, [sanity]);

  // Card deck initialization
  const initializeDeck = useCallback((diff: Difficulty) => {
    const newDeck = createDeck(diff);
    setCards(newDeck);
    setFlippedCards([]);
    setIsChecking(false);
    setMoves(0);
    setTimeElapsed(0);
    setSanity(100);
    setMatchedPairs(0);
    setRecentQuote(null);
  }, []);

  // Start game handler
  const handleStartGame = (diff: Difficulty) => {
    setDifficulty(diff);
    initializeDeck(diff);
    setPhase('playing');
    soundEngine.startAmbience();
  };

  // Change difficulty
  const handleSelectDifficulty = (diff: Difficulty) => {
    setDifficulty(diff);
    initializeDeck(diff);
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
  };

  // Save best score helper
  const updateBestScore = (diff: Difficulty, finalMoves: number, finalTime: number) => {
    const currentBest = bestScores[diff];
    const isNewBest = !currentBest || finalMoves < currentBest.moves || (finalMoves === currentBest.moves && finalTime < currentBest.time);

    if (isNewBest) {
      const newScores = {
        ...bestScores,
        [diff]: {
          moves: finalMoves,
          time: finalTime,
          date: new Date().toISOString(),
        },
      };
      setBestScores(newScores);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newScores));
      } catch {
        // LocalStorage fallback
      }
    }
  };

  // Card click handler
  const handleCardClick = (clickedCard: CardItem) => {
    if (isChecking || clickedCard.isFlipped || clickedCard.isMatched) return;

    soundEngine.playCardFlip();

    // Flip the clicked card
    const updatedCards = cards.map((c) =>
      c.instanceId === clickedCard.instanceId ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);

    const newFlipped = [...flippedCards, { ...clickedCard, isFlipped: true }];
    setFlippedCards(newFlipped);

    // If 2 cards are now flipped, compare them
    if (newFlipped.length === 2) {
      setIsChecking(true);
      setMoves((prev) => prev + 1);

      const [first, second] = newFlipped;
      const config = DIFFICULTY_CONFIGS[difficulty];

      if (first.entityId === second.entityId) {
        // MATCH!
        setTimeout(() => {
          soundEngine.playMatch();
          const matchedEntity = first.entity;

          setCards((prevCards) =>
            prevCards.map((c) =>
              c.entityId === first.entityId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );

          setDiscoveredEntityIds((prev) => new Set(prev).add(first.entityId));
          setRecentQuote({ name: matchedEntity.name, quote: matchedEntity.quote });

          // Recover sanity
          setSanity((prev) => Math.min(100, prev + config.sanityRecoveryOnMatch));

          const newMatchedCount = matchedPairs + 1;
          setMatchedPairs(newMatchedCount);
          setFlippedCards([]);
          setIsChecking(false);

          // Check Victory
          if (newMatchedCount >= config.pairsCount) {
            soundEngine.playVictory();
            updateBestScore(difficulty, moves + 1, timeElapsed);
            setPhase('victory');
          }
        }, 320);
      } else {
        // MISMATCH!
        setTimeout(() => {
          soundEngine.playMismatch();

          // Flash screen / shake
          setScreenPulse(true);
          setTimeout(() => setScreenPulse(false), 350);

          // Drain sanity
          const newSanity = Math.max(0, sanity - config.sanityDrainOnMismatch);
          setSanity(newSanity);

          // Mark cards with mismatch shake animation
          setCards((prevCards) =>
            prevCards.map((c) =>
              c.instanceId === first.instanceId || c.instanceId === second.instanceId
                ? { ...c, isMismatching: true }
                : c
            )
          );

          // Check Sanity collapse
          if (newSanity <= 0) {
            setTimeout(() => {
              soundEngine.playMadness();
              setPhase('game_over');
            }, 500);
          } else {
            // Flip back after short delay
            setTimeout(() => {
              setCards((prevCards) =>
                prevCards.map((c) =>
                  c.instanceId === first.instanceId || c.instanceId === second.instanceId
                    ? { ...c, isFlipped: false, isMismatching: false }
                    : c
                )
              );
              setFlippedCards([]);
              setIsChecking(false);
            }, 650);
          }
        }, 400);
      }
    }
  };

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];
  const sanityDeficit = 100 - sanity;
  const vignetteIntensity = Math.min(0.85, (sanityDeficit / 100) * 0.9);

  return (
    <div className="min-h-screen w-full bg-[#080c0e] text-[#d6e0db] flex flex-col relative overflow-x-hidden selection:bg-[#183a2e] selection:text-[#55e89d]">
      {/* Dynamic Cosmic Insanity Vignette (Darkens edges as sanity falls) */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-700"
        style={{
          boxShadow: `inset 0 0 ${40 + sanityDeficit * 1.5}px rgba(0, 0, 0, ${vignetteIntensity})`,
          opacity: sanity < 85 ? 1 : 0,
        }}
      />

      {/* Screen pulse shock effect on mismatch */}
      {screenPulse && (
        <div className="pointer-events-none fixed inset-0 z-40 bg-[#ef4444]/15 mix-blend-overlay transition-opacity duration-300" />
      )}

      {/* Low Sanity Tentacle Silhouette Hints */}
      {sanity < 40 && (
        <div className="pointer-events-none fixed inset-0 z-20 opacity-30 mix-blend-multiply animate-insanity-pulse overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,0 Q25,30 10,70 T0,100 L0,0 Z"
              fill="#020506"
              opacity="0.7"
            />
            <path
              d="M100,0 Q75,30 90,70 T100,100 L100,0 Z"
              fill="#020506"
              opacity="0.7"
            />
          </svg>
        </div>
      )}

      {phase === 'splash' ? (
        <IntroSplash
          selectedDifficulty={difficulty}
          onSelectDifficulty={setDifficulty}
          onStart={handleStartGame}
        />
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Top Bar HUD conforming to strict Top Bar Contract */}
          <GameHUD
            difficulty={difficulty}
            onSelectDifficulty={handleSelectDifficulty}
            moves={moves}
            timeElapsed={timeElapsed}
            isMuted={isMuted}
            onToggleMute={handleToggleMute}
            onRestart={() => initializeDeck(difficulty)}
            onOpenLore={() => setIsLoreOpen(true)}
            onReturnToSplash={() => setPhase('splash')}
            is3DMode={is3DMode}
            onToggle3DMode={() => setIs3DMode(!is3DMode)}
            isPS2Filter={isPS2Filter}
            onTogglePS2Filter={() => setIsPS2Filter((prev) => !prev)}
          />

          {/* Main Play Area */}
          <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-3 sm:px-6 sm:py-4 flex flex-col items-center">
            {/* Sanity Bar HUD */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 sm:mb-4">
              <SanityBar sanity={sanity} />

              {/* Progress and pairs discovered */}
              <div className="flex items-center gap-3 text-xs text-[#829e91]">
                <div className="bg-[#0c1417] px-3 py-1.5 rounded-lg border border-[#192b23] flex items-center gap-2">
                  <span className="font-cinzel text-[#8aa99c] uppercase text-[11px] tracking-wider">
                    Pares Alineados:
                  </span>
                  <span className="font-mono text-sm font-bold text-[#e6ede8] tabular-nums">
                    {matchedPairs} / {currentConfig.pairsCount}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLoreOpen(true)}
                  aria-label="Abrir Grimorio en móvil"
                  className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0c1417] border border-[#1d3529] text-xs font-cinzel text-[#8ca89a] hover:text-[#d7e5de]"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#34d399]" />
                  <span>Grimorio</span>
                </button>
              </div>
            </div>

            {/* Revealed quote banner when a match is found */}
            {recentQuote && (
              <div className="w-full max-w-2xl mb-3 px-4 py-2 rounded-lg bg-[#0e1916] border border-[#234435] text-xs text-[#a9c9bb] italic flex items-center justify-between animate-in fade-in duration-300">
                <span className="truncate">
                  <strong className="font-cinzel not-italic text-[#34d399]">{recentQuote.name}:</strong> "{recentQuote.quote}"
                </span>
                <button
                  type="button"
                  onClick={() => setRecentQuote(null)}
                  className="ml-2 text-[#567568] hover:text-[#e4efe9] text-xs font-bold"
                  aria-label="Cerrar cita"
                >
                  ✕
                </button>
              </div>
            )}

            {/* 3D Altar View or 2D Card Grid View */}
            {is3DMode ? (
              <div className="w-full max-w-4xl mx-auto my-auto py-1">
                <MemoryScene3D
                  cards={cards}
                  difficulty={difficulty}
                  onCardClick={handleCardClick}
                  disabled={isChecking}
                  isPS2Active={isPS2Filter}
                  onTogglePS2={() => setIsPS2Filter((prev) => !prev)}
                />
              </div>
            ) : (
              <div
                className={`w-full grid ${currentConfig.gridCols} gap-2 sm:gap-2.5 max-w-2xl md:max-w-3xl mx-auto my-auto py-1`}
              >
                {cards.map((card) => (
                  <MemoryCard
                    key={card.instanceId}
                    card={card}
                    onClick={handleCardClick}
                    disabled={isChecking}
                  />
                ))}
              </div>
            )}

            {/* Subtle Footer */}
            <footer className="mt-8 text-center text-xs text-[#526a60] flex items-center gap-2 font-cinzel">
              <span>Presentado por Undefine_Projects</span>
              <span>·</span>
              <span>Inspirado en el universo de H.P. Lovecraft</span>
            </footer>
          </main>
        </div>
      )}

      {/* Lore Grimoire Modal with 3D Bestiary Model trigger */}
      <LoreModal
        isOpen={isLoreOpen}
        onClose={() => setIsLoreOpen(false)}
        discoveredEntityIds={discoveredEntityIds}
        activeEntity={inspectEntity}
        onInspect3D={(entity) => {
          setIsLoreOpen(false);
          setInspect3DEntity(entity);
        }}
      />

      {/* 3D Model Bestiary Viewer */}
      <ModelViewer3D
        entity={inspect3DEntity}
        isOpen={Boolean(inspect3DEntity)}
        onClose={() => setInspect3DEntity(null)}
        defaultPS2={isPS2Filter}
      />

      {/* Victory Modal */}
      <VictoryModal
        isOpen={phase === 'victory'}
        stats={{
          moves,
          timeElapsed,
          sanity,
          matchedPairs,
          totalPairs: currentConfig.pairsCount,
        }}
        difficulty={difficulty}
        bestScore={bestScores[difficulty]}
        onRestart={() => initializeDeck(difficulty)}
        onOpenLore={() => {
          setPhase('playing');
          setIsLoreOpen(true);
        }}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={phase === 'game_over'}
        moves={moves}
        timeElapsed={timeElapsed}
        onRestart={() => initializeDeck(difficulty)}
      />
    </div>
  );
}
