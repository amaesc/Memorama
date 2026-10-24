import React from 'react';
import { MYTHOS_ENTITIES } from '../data/lovecraftCards';
import { MythosEntity } from '../types/game';
import { MythosIcon } from './MythosIcons';
import { X, BookOpen, Quote } from 'lucide-react';

interface LoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  discoveredEntityIds: Set<string>;
  activeEntity?: MythosEntity | null;
  onInspect3D?: (entity: MythosEntity) => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({
  isOpen,
  onClose,
  discoveredEntityIds,
  activeEntity,
  onInspect3D,
}) => {
  const [selectedEntity, setSelectedEntity] = React.useState<MythosEntity>(
    activeEntity || MYTHOS_ENTITIES[0]
  );

  React.useEffect(() => {
    if (activeEntity) {
      setSelectedEntity(activeEntity);
    }
  }, [activeEntity]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] flex flex-col bg-[#0b1215] border border-[#233f33] rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#192b23] bg-[#080d0f]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#34d399]" />
            <h2 className="font-cinzel text-lg font-bold text-[#e6ede8] tracking-wider">
              Grimorio de los Primigenios
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#748c81] hover:text-[#e6ede8] hover:bg-[#14221c] transition-colors"
            aria-label="Cerrar Grimorio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Sidebar List + Entity Detail */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* List of entities */}
          <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-[#192b23] overflow-y-auto p-2 bg-[#090f12]">
            <div className="text-[10px] font-cinzel uppercase tracking-[0.16em] text-[#557064] px-2 py-1.5">
              Entidades de los Mitos ({discoveredEntityIds.size}/{MYTHOS_ENTITIES.length})
            </div>
            <div className="space-y-1">
              {MYTHOS_ENTITIES.map((ent) => {
                const isDiscovered = discoveredEntityIds.has(ent.id);
                const isSelected = selectedEntity.id === ent.id;

                return (
                  <button
                    key={ent.id}
                    type="button"
                    onClick={() => setSelectedEntity(ent)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-[#152720] text-[#e6ede8] font-semibold border border-[#2b4d3f]'
                        : 'text-[#8da49a] hover:bg-[#0e171b] hover:text-[#c4d6ce]'
                    }`}
                  >
                    <span className="font-cinzel truncate">{ent.name}</span>
                    {isDiscovered ? (
                      <span className="text-[10px] text-[#34d399]">Revelado</span>
                    ) : (
                      <span className="text-[10px] text-[#42554c]">Oculto</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Entity Lore Card */}
          <div className="flex-1 p-6 overflow-y-auto bg-[#0c1418]">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <div className="w-24 h-24 rounded-xl bg-[#080d0f] border-2 border-[#223d31] p-3 flex items-center justify-center shadow-lg shrink-0">
                <MythosIcon
                  type={selectedEntity.iconType}
                  color={selectedEntity.color}
                  className="w-16 h-16"
                />
              </div>

              <div className="text-center sm:text-left">
                <span
                  className="text-xs uppercase tracking-widest font-cinzel font-semibold"
                  style={{ color: selectedEntity.color }}
                >
                  {selectedEntity.title}
                </span>
                <h3 className="text-2xl font-cinzel font-bold text-[#e6ede8] mt-1 mb-2">
                  {selectedEntity.name}
                </h3>
                <span className="text-xs text-[#6e857b] font-medium block">
                  Fuente: {selectedEntity.source}
                </span>
              </div>
            </div>

            {/* Lore Quote */}
            <div className="bg-[#080e11] border-l-2 border-[#34d399] p-4 rounded-r-lg mb-4">
              <div className="flex items-start gap-2">
                <Quote className="w-5 h-5 text-[#34d399] shrink-0 mt-0.5" />
                <p className="text-sm italic text-[#c2d4cb] leading-relaxed font-sans">
                  "{selectedEntity.quote}"
                </p>
              </div>
            </div>

            {/* Mythos Context */}
            <div className="text-xs text-[#8ca397] leading-relaxed space-y-2 mb-6">
              <p>
                Los Antiguos gobernaron la Tierra millones de años antes de la llegada del hombre,
                esperando en profundas simas oceánicas y dimensiones angulares que las estrellas
                vuelvan a alinearse.
              </p>
            </div>

            {/* 3D Model Inspection Button */}
            {onInspect3D && (
              <button
                type="button"
                onClick={() => onInspect3D(selectedEntity)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#152a21] hover:bg-[#1d3d2f] border border-[#2e5d47] text-xs font-cinzel font-bold text-[#e6ede8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Inspeccionar Modelo 3D de la Bestia</span>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#192b23] bg-[#080d0f] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#14231d] hover:bg-[#1e342a] text-xs font-cinzel uppercase tracking-wider text-[#d2e2d9] transition-colors"
          >
            Volver a la Mesa
          </button>
        </div>
      </div>
    </div>
  );
};
