import React from 'react';
import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  moves: number;
  timeElapsed: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  moves,
  timeElapsed,
  onRestart,
}) => {
  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0f090b] border-2 border-[#571919] rounded-2xl p-6 sm:p-8 text-center shadow-[0_0_50px_rgba(239,68,68,0.25)]">
        {/* Skull Icon with dark crimson glow */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1e0e12] border border-[#ef4444] flex items-center justify-center shadow-[0_0_24px_rgba(239,68,68,0.4)]">
          <Skull className="w-8 h-8 text-[#ef4444] animate-pulse" />
        </div>

        <span className="text-xs uppercase tracking-[0.25em] font-cinzel text-[#b85c5c] block mb-1">
          La Mente ha Sucumbido
        </span>

        <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-[#fecaca] mb-3">
          LOCURA ABSOLUTA
        </h2>

        <p className="text-xs text-[#c49292] font-sans leading-relaxed mb-6 max-w-sm mx-auto">
          Los secretos cósmicos del vacío quebrantaron tu mente. Las geometrías no euclidianas
          y los susurros de los Primigenios ahora habitan tus pensamientos para siempre.
        </p>

        {/* Breakdown */}
        <div className="flex items-center justify-center gap-6 mb-8 text-xs text-[#9c6f6f]">
          <div>
            Turnos resistidos: <strong className="text-[#fecaca] font-mono">{moves}</strong>
          </div>
          <span>·</span>
          <div>
            Tiempo en el abismo: <strong className="text-[#fecaca] font-mono">{formatTime(timeElapsed)}</strong>
          </div>
        </div>

        <button
          type="button"
          onClick={onRestart}
          className="px-8 py-3 rounded-lg bg-[#2b1014] hover:bg-[#3b171c] border border-[#7f1d1d] hover:border-[#ef4444] text-xs font-cinzel font-bold uppercase tracking-[0.16em] text-[#fee2e2] flex items-center justify-center gap-2 mx-auto transition-all cursor-pointer shadow-lg hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        >
          <RotateCcw className="w-4 h-4 text-[#ef4444]" />
          <span>Restaurar Cordura y Reintentar</span>
        </button>
      </div>
    </div>
  );
};
