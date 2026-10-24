import React from 'react';
import { Difficulty } from '../types/game';
import { Volume2, VolumeX, RotateCcw, BookOpen, Clock, Move, Box, Gamepad2 } from 'lucide-react';

interface GameHUDProps {
  difficulty: Difficulty;
  onSelectDifficulty: (diff: Difficulty) => void;
  moves: number;
  timeElapsed: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onRestart: () => void;
  onOpenLore: () => void;
  onReturnToSplash: () => void;
  is3DMode: boolean;
  onToggle3DMode: () => void;
  isPS2Filter: boolean;
  onTogglePS2Filter: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  difficulty,
  onSelectDifficulty,
  moves,
  timeElapsed,
  isMuted,
  onToggleMute,
  onRestart,
  onOpenLore,
  onReturnToSplash,
  is3DMode,
  onToggle3DMode,
  isPS2Filter,
  onTogglePS2Filter,
}) => {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <header className="w-full flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-8 py-2.5 sm:py-3.5 border-b border-[#182821] bg-[#070b0d]/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark (Single text element) */}
      <button
        type="button"
        onClick={onReturnToSplash}
        className="text-left group cursor-pointer focus-visible:outline-none shrink-0"
        title="Volver a la portada de Undefine_Projects"
      >
        <div className="font-cinzel text-xs sm:text-base font-bold tracking-wider text-[#e6ede8] group-hover:text-[#4ade80] transition-colors whitespace-nowrap">
          CRÓNICAS DEL ABISMO
        </div>
        <div className="text-[9px] sm:text-[10px] text-[#5c7a6e] font-cinzel tracking-widest uppercase">
          Undefine_Projects
        </div>
      </button>

      {/* Zone 2: Navigation & Difficulty Selectors (Clean segmented controls) */}
      <nav className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Difficulty segmented control */}
        <div className="flex items-center p-0.5 rounded-lg bg-[#0c1417] border border-[#1a2d24]">
          <button
            type="button"
            onClick={() => onSelectDifficulty('easy')}
            className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-cinzel rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              difficulty === 'easy'
                ? 'bg-[#183125] text-[#34d399] font-bold shadow-xs'
                : 'text-[#688577] hover:text-[#c4d6ce]'
            }`}
          >
            Fácil
          </button>
          <button
            type="button"
            onClick={() => onSelectDifficulty('normal')}
            className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-cinzel rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              difficulty === 'normal'
                ? 'bg-[#183125] text-[#34d399] font-bold shadow-xs'
                : 'text-[#688577] hover:text-[#c4d6ce]'
            }`}
          >
            Normal
          </button>
          <button
            type="button"
            onClick={() => onSelectDifficulty('hard')}
            className={`px-1.5 sm:px-2.5 py-1 text-[10px] sm:text-xs font-cinzel rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              difficulty === 'hard'
                ? 'bg-[#183125] text-[#34d399] font-bold shadow-xs'
                : 'text-[#688577] hover:text-[#c4d6ce]'
            }`}
          >
            Demente
          </button>
        </div>

        {/* Grimorio Button */}
        <button
          type="button"
          onClick={onOpenLore}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1d3328] hover:border-[#2f5543] bg-[#0c1417] text-xs font-cinzel text-[#8ca89a] hover:text-[#e4efe9] transition-colors whitespace-nowrap cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#34d399]" />
          <span>Grimorio</span>
        </button>

        {/* 2D / 3D Mode Toggle */}
        <button
          type="button"
          onClick={onToggle3DMode}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-cinzel rounded-lg border transition-colors cursor-pointer ${
            is3DMode
              ? 'bg-[#183427] border-[#34d399] text-[#eefcf4] shadow-[0_0_10px_rgba(52,211,153,0.3)] font-bold'
              : 'bg-[#0c1417] border-[#1d3328] text-[#8ca89a] hover:text-[#e4efe9]'
          }`}
          title={is3DMode ? 'Cambiar a vista de cartas 2D' : 'Cambiar a Altar 3D con Modelos de Bestias'}
        >
          <Box className="w-3.5 h-3.5 text-[#34d399]" />
          <span className="hidden sm:inline">{is3DMode ? 'Altar 3D' : 'Mesa 2D'}</span>
          <span className="sm:hidden">{is3DMode ? '3D' : '2D'}</span>
        </button>

        {/* PS2 Shader Toggle */}
        <button
          type="button"
          onClick={onTogglePS2Filter}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-cinzel rounded-lg border transition-colors cursor-pointer ${
            isPS2Filter
              ? 'bg-[#183427] border-[#34d399] text-[#eefcf4] shadow-[0_0_10px_rgba(52,211,153,0.3)] font-bold'
              : 'bg-[#0c1417] border-[#1d3328] text-[#8ca89a] hover:text-[#e4efe9]'
          }`}
          title={isPS2Filter ? 'Desactivar Shader PS2 (Bayer dithering & Scanlines)' : 'Activar Shader PlayStation 2'}
        >
          <Gamepad2 className="w-3.5 h-3.5 text-[#34d399]" />
          <span className="hidden sm:inline">PS2</span>
          <span className={`text-[10px] uppercase font-mono px-1 rounded ${isPS2Filter ? 'bg-[#34d399]/20 text-[#4ade80]' : 'text-[#6b8277]'}`}>
            {isPS2Filter ? 'ON' : 'OFF'}
          </span>
        </button>
      </nav>

      {/* Zone 3: Stats & Primary Actions (Audio toggle + Reset) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Subtle tabular counters */}
        <div className="hidden md:flex items-center gap-3 text-xs text-[#718f81] bg-[#0c1417] px-3 py-1 rounded-lg border border-[#192b22]">
          <span className="flex items-center gap-1">
            <Move className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="font-mono tabular-nums text-[#d0ded7]">{moves}</span>
          </span>
          <span className="text-[#2b3d35]">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="font-mono tabular-nums text-[#d0ded7]">{formatTime(timeElapsed)}</span>
          </span>
        </div>

        {/* Mute Button */}
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          className={`p-2 rounded-lg border text-xs transition-colors cursor-pointer ${
            isMuted
              ? 'bg-[#141a1c] border-[#293538] text-[#55696f]'
              : 'bg-[#10241b] border-[#29503d] text-[#34d399]'
          }`}
          title={isMuted ? 'Activar sonido tenebroso' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Restart Button */}
        <button
          type="button"
          onClick={onRestart}
          aria-label="Reiniciar mesa de juego"
          className="p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#142820] hover:bg-[#1d3d30] border border-[#2b5843] text-xs font-cinzel text-[#e6ede8] flex items-center gap-1.5 transition-colors cursor-pointer"
          title="Reiniciar rito"
        >
          <RotateCcw className="w-4 h-4 text-[#34d399]" />
          <span className="hidden sm:inline">Reiniciar</span>
        </button>
      </div>
    </header>
  );
};
