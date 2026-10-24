import React from 'react';
import { GameStats, Difficulty, BestScore } from '../types/game';
import { Award, RotateCcw, Clock, Move, Brain, BookOpen } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  stats: GameStats;
  difficulty: Difficulty;
  bestScore: BestScore | null;
  onRestart: () => void;
  onOpenLore: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stats,
  difficulty,
  bestScore,
  onRestart,
  onOpenLore,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getTitleRank = (sanity: number) => {
    if (sanity >= 80) return 'Gran Erudito de la Logia Hermética';
    if (sanity >= 50) return 'Investigador de Arkham Sobreviviente';
    return 'Navegante de la Penumbra Alucinada';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0b1317] border-2 border-[#2b5944] rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(34,197,94,0.2)]">
        {/* Arcane emblem */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#10241b] border border-[#34d399] flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
          <Award className="w-8 h-8 text-[#34d399]" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#6ea389] block mb-1">
          Rito Arcano Concluido
        </span>

        <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#e8f5ee] mb-2">
          VICTORIA SOBRE EL CAOS
        </h2>

        <p className="text-xs text-[#a3b8ad] font-cinzel italic mb-6">
          "{getTitleRank(stats.sanity)}"
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-[#070c0e] border border-[#1b3127] p-4 rounded-xl">
          <div className="flex flex-col items-center">
            <Move className="w-4 h-4 text-[#82a896] mb-1" />
            <span className="text-[10px] text-[#718a7d] uppercase tracking-wider">Movimientos</span>
            <span className="font-mono text-base font-bold text-[#e6ede8] tabular-nums">
              {stats.moves}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-[#182921]">
            <Clock className="w-4 h-4 text-[#82a896] mb-1" />
            <span className="text-[10px] text-[#718a7d] uppercase tracking-wider">Tiempo</span>
            <span className="font-mono text-base font-bold text-[#e6ede8] tabular-nums">
              {formatTime(stats.timeElapsed)}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <Brain className="w-4 h-4 text-[#34d399] mb-1" />
            <span className="text-[10px] text-[#718a7d] uppercase tracking-wider">Cordura</span>
            <span className="font-mono text-base font-bold text-[#34d399] tabular-nums">
              {stats.sanity}%
            </span>
          </div>
        </div>

        {/* Best Score reference */}
        {bestScore && (
          <div className="text-[11px] text-[#637d71] mb-6">
            Mejor Récord Previo: <strong className="text-[#a4b8ad] font-mono">{bestScore.moves}</strong> movimientos en <strong className="text-[#a4b8ad] font-mono">{formatTime(bestScore.time)}</strong>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onRestart}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#142820] hover:bg-[#1c382c] border border-[#2d5843] text-xs font-cinzel font-bold uppercase tracking-wider text-[#e6ede8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#34d399]" />
            <span>Nuevo Rito</span>
          </button>

          <button
            type="button"
            onClick={onOpenLore}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#0e171b] hover:bg-[#162329] border border-[#1e3328] text-xs font-cinzel uppercase tracking-wider text-[#9bb3a6] flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Consultar Grimorio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
