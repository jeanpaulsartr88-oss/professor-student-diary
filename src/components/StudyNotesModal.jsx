import React from 'react';
import { useApp } from '../context/AppContext';
import { X, BookOpen, CheckCircle2, Feather, Sparkles } from 'lucide-react';

export const StudyNotesModal = ({ module, onClose }) => {
  const { finishNotes, openCabinetWithModule, modulesState } = useApp();

  if (!module) return null;

  const currentModState = modulesState?.[module.id] || {};
  const isCompleted = currentModState.status === 'completed' || module.status === 'completed';

  const handleFinishAndReport = () => {
    finishNotes(module.id);
    onClose();
    openCabinetWithModule(module.id);
  };

  const handleOnlyFinish = () => {
    finishNotes(module.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1c1b22] border border-[#d4af37]/40 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#722f37] to-[#4a1820] p-4 text-[#fffffe] flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-black/40 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-display tracking-widest text-[#f3e29f]">
                {module.order ? `МОДУЛЬ ${module.order}` : 'КОНСПЕКТ'}
              </span>
              <h3 className="text-sm font-semibold leading-tight font-serif-vintage line-clamp-1">
                {module.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/40 text-[#a7a9be] hover:text-[#fffffe] flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-sm text-[#e4e4e7]">
          {/* Atmosphere Banner */}
          <div className="p-3 rounded-xl bg-[#16161a] border border-[#2e2b38] flex items-start space-x-2.5">
            <Feather className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <p className="text-xs text-[#a7a9be] italic font-serif-vintage leading-relaxed">
              {module.description}
            </p>
          </div>

          {/* Theoretical Material / Notes */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider font-display text-[#d4af37] flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Выдержки из закрытого пособия кафедры:</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-[#24222e] border-l-2 border-[#d4af37] text-xs font-serif-vintage leading-relaxed text-[#fffffe]/90 shadow-inner">
              {module.notes}
            </div>
          </div>

          {/* Student's Study Checklist */}
          <div className="space-y-2 bg-[#16161a] p-3.5 rounded-xl border border-[#2e2b38]">
            <span className="text-[11px] font-semibold text-[#a7a9be] uppercase tracking-wide">
              План самоподготовки студентки:
            </span>
            <ul className="space-y-2 text-xs text-[#c5c6d0]">
              {(module.tasks || [
                'Изучить базовые определения субординации',
                'Отрепетировать спокойный прямой взгляд перед зеркалом',
                'Подготовить аккуратную тетрадь с конспектом для проверки'
              ]).map((task, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCompleted ? 'text-emerald-400' : 'text-[#d4af37]'}`} />
                  <span className="leading-relaxed font-serif-vintage text-xs text-[#e4e4e7]">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-3.5 bg-[#16161a] border-t border-[#2e2b38] flex flex-col sm:flex-row gap-2 shrink-0">
          {isCompleted ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  openCabinetWithModule(module.id);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-semibold tracking-wide border border-[#d4af37]/40 shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#f3e29f]" />
                <span>Открыть протокол аттестации кафедры</span>
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#c5c6d0] text-xs border border-[#3a3546] active:scale-95 transition-all text-center"
              >
                Закрыть формуляр
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleFinishAndReport}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-semibold tracking-wide border border-[#d4af37]/40 shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>✍️ Завершить и сразу доложить</span>
              </button>
              <button
                onClick={handleOnlyFinish}
                className="py-2.5 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#c5c6d0] text-xs border border-[#3a3546] active:scale-95 transition-all text-center"
              >
                Сохранить статус готовности
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
