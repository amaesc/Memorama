import React from 'react';
import { Difficulty } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../data/lovecraftCards';
import { Sparkles, Eye, Skull, Volume2, ShieldAlert } from 'lucide-react';

interface IntroSplashProps {
  onStart: (difficulty: Difficulty) => void;
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({
  onStart,
  selectedDifficulty,
  onSelectDifficulty,
}) => {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#070b0d] overflow-hidden">
      {/* Background radial gradient & fog */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(20,40,32,0.45)_0%,rgba(7,11,13,0.95)_75%,#05080a_100%)] pointer-events-none" />
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#1e3a2f_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Decorative occult ring */}
      <div className="absolute w-[500px] h-[500px] rounded-full border border-[#1b3528]/40 animate-spin [animation-duration:90s] pointer-events-none flex items-center justify-center">
        <div className="w-[420px] h-[420px] rounded-full border border-dashed border-[#244b39]/30" />
      </div>

      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        {/* Mandatory user requirement: Presentado por Undefine_Projects */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full bg-[#0d1619] border border-[#1e342a] shadow-inner text-[#82b49e]">
          <Sparkles className="w-3.5 h-3.5 text-[#34d399] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.25em] font-medium font-cinzel">
            Presentado por <strong className="text-[#a7f3d0] font-bold">Undefine_Projects</strong>
          </span>
        </div>

        {/* Occult Eye / Sigil Emblem */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#0b1414] border border-[#2d5241] flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.18)]">
            <Eye className="w-10 h-10 text-[#34d399] animate-pulse" />
          </div>
        </div>

        {/* Main Title with Gothic Typography */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-wider text-[#e6ece8] mb-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          CRÓNICAS DEL ABISMO
        </h1>

        <p className="font-cinzel text-sm sm:text-base text-[#7c9e90] tracking-[0.18em] uppercase mb-3">
          Memoria de los Mitos de Cthulhu
        </p>

        <p className="text-sm text-[#94a3b8] max-w-lg mb-8 leading-relaxed font-sans">
          Alinea los fragmentos arcanos del <span className="text-[#cbd5e1] italic font-cinzel">Necronomicón</span>.
          Cada error resquebraja tu mente y te sumerge en las sombras del espacio cósmico.
        </p>

        {/* Difficulty Selection */}
        <div className="w-full max-w-md bg-[#0a1114]/90 border border-[#1b2b24] p-4 rounded-xl mb-8 backdrop-blur-sm shadow-2xl">
          <span className="block text-xs font-cinzel uppercase tracking-[0.15em] text-[#789d8d] mb-3">
            Elige el Calibre de tu Investigación
          </span>

          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'normal', 'hard'] as Difficulty[]).map((diff) => {
              const cfg = DIFFICULTY_CONFIGS[diff];
              const isSelected = selectedDifficulty === diff;
              return (
                <button
                  key={diff}
                  type="button"
                  onClick={() => onSelectDifficulty(diff)}
                  className={`px-3 py-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#152a21] border-[#34d399] text-[#eefcf4] shadow-[0_0_12px_rgba(52,211,153,0.25)]'
                      : 'bg-[#0e171a] border-[#182721] text-[#71857c] hover:border-[#243e33] hover:text-[#b0c4ba]'
                  }`}
                >
                  <div className="text-xs font-bold font-cinzel">{cfg.name === 'easy' ? 'Novicio' : cfg.name === 'normal' ? 'Erudito' : 'Demente'}</div>
                  <div className="text-[11px] opacity-75">{cfg.cardsCount} cartas</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main CTA */}
        <button
          type="button"
          onClick={() => onStart(selectedDifficulty)}
          className="group relative px-8 py-3.5 rounded-lg bg-[#142820] hover:bg-[#1c3a2f] border border-[#2d5945] hover:border-[#4ade80] text-[#e8f7ee] font-cinzel font-bold text-sm tracking-[0.16em] uppercase shadow-[0_4px_24px_rgba(20,50,38,0.6)] transition-all transform hover:-translate-y-0.5 cursor-pointer active:translate-y-0"
        >
          <span className="flex items-center gap-2">
            <span>Iniciar Invocación</span>
            <Skull className="w-4 h-4 text-[#34d399] group-hover:rotate-12 transition-transform" />
          </span>
        </button>

        {/* Atmosphere hint */}
        <div className="mt-8 flex items-center gap-4 text-xs text-[#526a60]">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> Audio procedural inmersivo
          </span>
          <span className="text-[#2b3a33]">·</span>
          <span className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> Mecánica de cordura reactiva
          </span>
        </div>
      </div>
    </div>
  );
};
