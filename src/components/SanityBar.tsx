import React from 'react';
import { Activity, ShieldAlert, Skull, Brain } from 'lucide-react';

interface SanityBarProps {
  sanity: number;
}

export const SanityBar: React.FC<SanityBarProps> = ({ sanity }) => {
  // Clamped sanity 0 - 100
  const clampedSanity = Math.max(0, Math.min(100, sanity));

  let statusText = 'Mente Firme';
  let colorClass = 'from-[#10b981] to-[#059669]';
  let borderClass = 'border-[#1b3a2e]';
  let textClass = 'text-[#34d399]';
  let pulseSpeed = 'duration-1000';

  if (clampedSanity <= 0) {
    statusText = 'Locura Absoluta';
    colorClass = 'from-[#dc2626] to-[#7f1d1d]';
    borderClass = 'border-[#5f1d1d]';
    textClass = 'text-[#ef4444]';
    pulseSpeed = 'duration-300';
  } else if (clampedSanity < 25) {
    statusText = 'Al Borde del Abismo';
    colorClass = 'from-[#ef4444] to-[#b91c1c]';
    borderClass = 'border-[#4a1c1c]';
    textClass = 'text-[#f87171]';
    pulseSpeed = 'duration-300';
  } else if (clampedSanity < 50) {
    statusText = 'Paranoia y Susurros';
    colorClass = 'from-[#f97316] to-[#c2410c]';
    borderClass = 'border-[#422214]';
    textClass = 'text-[#fb923c]';
    pulseSpeed = 'duration-500';
  } else if (clampedSanity < 75) {
    statusText = 'Inquietud Arcana';
    colorClass = 'from-[#eab308] to-[#ca8a04]';
    borderClass = 'border-[#3a3219]';
    textClass = 'text-[#facc15]';
    pulseSpeed = 'duration-700';
  }

  return (
    <div className={`w-full max-w-md bg-[#0c1316] border ${borderClass} rounded-lg p-3 shadow-lg transition-colors duration-500`}>
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <div className="flex items-center gap-1.5">
          <Brain className={`w-4 h-4 ${textClass}`} />
          <span className="font-cinzel tracking-wider text-[#9bb0a5] uppercase text-[11px]">
            Cordura del Investigador
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium ${textClass}`}>
            {statusText}
          </span>
          <span className="font-mono text-xs tabular-nums text-[#d2ded8] font-bold">
            {clampedSanity}%
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="h-2.5 w-full bg-[#060a0c] rounded-full overflow-hidden border border-[#141f22] p-[1px]">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colorClass} transition-all duration-300 shadow-[0_0_8px_rgba(34,197,94,0.3)]`}
          style={{ width: `${clampedSanity}%` }}
        />
      </div>

      {/* Warning indicator when sanity < 35 */}
      {clampedSanity < 35 && clampedSanity > 0 && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#f87171] animate-pulse">
          <ShieldAlert className="w-3 h-3 shrink-0" />
          <span>¡La niebla cósmica y las sombras amenazan con nublar tu vista!</span>
        </div>
      )}
    </div>
  );
};
