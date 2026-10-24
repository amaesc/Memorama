import React from 'react';
import { CardItem } from '../types/game';
import { MythosIcon } from './MythosIcons';
import { Eye } from 'lucide-react';

interface MemoryCardProps {
  card: CardItem;
  onClick: (card: CardItem) => void;
  disabled: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, disabled }) => {
  const isRevealed = card.isFlipped || card.isMatched;

  return (
    <div
      className={`perspective-1000 w-full aspect-[3/4] max-h-28 sm:max-h-36 md:max-h-38 select-none ${
        card.isMismatching ? 'animate-[shake_0.4s_ease-in-out]' : ''
      }`}
    >
      <button
        type="button"
        disabled={disabled || card.isMatched || card.isFlipped}
        onClick={() => onClick(card)}
        aria-label={isRevealed ? `${card.entity.name}: ${card.entity.title}` : 'Carta de los Mitos oculta'}
        className={`relative w-full h-full text-left transition-transform duration-300 transform-style-3d cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-[#34d399] ${
          isRevealed ? 'rotate-y-180' : 'hover:scale-[1.02]'
        } ${card.isMatched ? 'opacity-85' : ''}`}
      >
        {/* CARD BACK (Hidden Face) */}
        <div className="absolute inset-0 w-full h-full backface-hidden rounded-lg bg-[#0e171b] border-2 border-[#1c2e27] hover:border-[#2f5544] p-2 flex flex-col items-center justify-between shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-colors overflow-hidden">
          {/* Subtle corner runes */}
          <div className="w-full flex justify-between text-[10px] text-[#2c493c] font-cinzel select-none">
            <span>ψ</span>
            <span>Ω</span>
          </div>

          {/* Central Eldritch Eye Sigil */}
          <div className="relative w-12 h-12 rounded-full border border-[#203a2e] bg-[#090f12] flex items-center justify-center shadow-inner group">
            <div className="absolute inset-1 rounded-full border border-dashed border-[#2f5544]/40 animate-spin [animation-duration:40s]" />
            <Eye className="w-5 h-5 text-[#2e5d48] group-hover:text-[#4ade80] transition-colors" />
          </div>

          <div className="text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-cinzel text-[#3a584c]">
              R'lyeh
            </span>
          </div>
        </div>

        {/* CARD FRONT (Revealed Face) */}
        <div
          className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-lg bg-[#0b1317] border-2 p-2 flex flex-col items-center justify-between shadow-xl overflow-hidden ${
            card.isMatched
              ? 'border-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-[#0c1815]'
              : 'border-[#2d4d3e]'
          }`}
        >
          {/* Top category / title */}
          <div className="w-full text-center">
            <span
              className="text-[9px] uppercase tracking-wider font-cinzel font-semibold truncate block"
              style={{ color: card.entity.color }}
            >
              {card.entity.title}
            </span>
          </div>

          {/* Icon illustration */}
          <div className="my-auto flex items-center justify-center p-1">
            <MythosIcon
              type={card.entity.iconType}
              color={card.entity.color}
              className="w-10 h-10 sm:w-14 sm:h-14 transition-transform duration-200"
            />
          </div>

          {/* Bottom Entity Name */}
          <div className="w-full text-center border-t border-[#192723] pt-1">
            <span className="text-[11px] sm:text-xs font-cinzel font-bold text-[#e6ece8] truncate block">
              {card.entity.name}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};
