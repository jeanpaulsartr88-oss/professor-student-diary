import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyNotesModal } from './StudyNotesModal';
import {
  BookOpen,
  Lock,
  Hourglass,
  Edit3,
  CheckCircle,
  ChevronRight,
  Sparkles,
  MapPin,
  RotateCcw,
} from 'lucide-react';

export const JournalScreen = () => {
  const {
    scenarioData,
    modulesState,
    startStudying,
    openCabinetWithModule,
    score,
  } = useApp();

  const [activeNotesModule, setActiveNotesModule] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'not_started':
        return {
          label: '⏳ Не начато',
          color: 'bg-[#24222e] text-[#a7a9be] border-[#3a3546]',
          icon: Hourglass,
        };
      case 'learning':
        return {
          label: '📖 Учит тему',
          color: 'bg-amber-950/40 text-amber-300 border-amber-600/40',
          icon: BookOpen,
        };
      case 'ready_to_report':
        return {
          label: '✍️ Готова к докладу',
          color: 'bg-[#722f37]/50 text-[#f3e29f] border-[#d4af37]/60 font-semibold',
          icon: Edit3,
        };
      case 'completed':
        return {
          label: '🔒 Сдано на кафедре',
          color: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40',
          icon: CheckCircle,
        };
      default:
        return {
          label: '⏳ Не начато',
          color: 'bg-[#24222e] text-[#a7a9be] border-[#3a3546]',
          icon: Hourglass,
        };
    }
  };

  const steps = [
    { key: 'not_started', label: 'Не начато', icon: '⏳' },
    { key: 'learning', label: 'Учит тему', icon: '📖' },
    { key: 'ready_to_report', label: 'Готова', icon: '✍️' },
    { key: 'completed', label: 'Сдано', icon: '🔒' },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'not_started':
        return 0;
      case 'learning':
        return 1;
      case 'ready_to_report':
        return 2;
      case 'completed':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 max-w-lg mx-auto w-full">
      {/* Screen Title & Academic Epigraph */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-4 relative overflow-hidden shadow-lg">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#722f37]/15 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
            УЧЕБНЫЙ ПЛАН СТУДЕНТКИ
          </span>
          <span className="text-[10px] text-[#a7a9be] font-serif-vintage italic">
            Семестр I • Кафедра субординации
          </span>
        </div>
        <h2 className="text-lg font-bold font-serif-vintage text-[#fffffe] tracking-wide">
          Журнал подготовки к защите
        </h2>
        <p className="text-xs text-[#a7a9be] mt-1 font-serif-vintage italic leading-relaxed">
          «Практические материалы и отчеты передаются студенткой лично научруку в Telegram. В приложении фиксируются статус готовности, официальная обратная связь и баллы зачета.»
        </p>
      </div>

      {/* Modules List */}
      <div className="space-y-3.5 pb-6">
        {scenarioData.modules.map((module) => {
          const modState = modulesState[module.id] || { status: 'not_started' };
          const status = modState.status;
          const statusBadge = getStatusBadge(status);
          const currentStepIdx = getStepIndex(status);

          // Check if locked by minimum score requirement
          const isScoreLocked = module.min_score_required > score;

          return (
            <div
              key={module.id}
              className={`rounded-2xl transition-all duration-200 border relative overflow-hidden ${
                status === 'ready_to_report'
                  ? 'bg-[#1c1b22] border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.12)]'
                  : status === 'completed'
                  ? 'bg-[#1c1b22]/90 border-[#2e2b38]'
                  : 'bg-[#1c1b22] border-[#2e2b38]'
              }`}
            >
              {/* Header inside card */}
              <div className="p-4 space-y-2.5">
                {/* Order & Location info */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-1.5 text-[11px] text-[#d4af37] font-semibold">
                    <span className="w-5 h-5 rounded-full bg-[#722f37]/40 border border-[#d4af37]/40 flex items-center justify-center text-[10px]">
                      {module.order}
                    </span>
                    <span className="font-display tracking-wider uppercase text-[10px]">
                      Этап {module.order}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 text-[10px] text-[#a7a9be] truncate max-w-[170px]">
                    <MapPin className="w-3 h-3 text-[#722f37] shrink-0" />
                    <span className="truncate">{module.room || 'Кабинет кафедры'}</span>
                  </div>
                </div>

                {/* Module Title & Subtitle */}
                <div>
                  <h3 className="text-base font-bold text-[#fffffe] font-serif-vintage leading-tight">
                    {module.title}
                  </h3>
                  <p className="text-xs text-[#a7a9be] mt-0.5 font-serif-vintage italic line-clamp-2">
                    {module.subtitle}
                  </p>
                </div>

                {/* Description Preview */}
                <p className="text-xs text-[#8f90a6] leading-relaxed line-clamp-2 bg-[#16161a]/60 p-2.5 rounded-xl border border-[#2e2b38]/60">
                  {module.description}
                </p>

                {/* Status Indicator Pipeline: [Не начато] -> [Учит тему] -> [Готова] -> [Сдано] */}
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[10px] text-[#a7a9be] mb-1.5 px-0.5">
                    <span className="font-semibold text-[#c5c6d0]">Прогресс сдачи:</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] border ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Visual Step Dots and Bar */}
                  <div className="grid grid-cols-4 gap-1 relative">
                    {steps.map((step, idx) => {
                      const isPassed = currentStepIdx >= idx;
                      const isCurrent = currentStepIdx === idx;

                      return (
                        <div
                          key={step.key}
                          className={`text-center py-1.5 px-1 rounded-lg border text-[9px] transition-all flex flex-col items-center justify-center space-y-0.5 ${
                            isCurrent
                              ? 'bg-[#722f37]/40 border-[#d4af37] text-[#f3e29f] font-bold shadow-sm'
                              : isPassed
                              ? 'bg-emerald-950/30 border-emerald-600/40 text-emerald-300'
                              : 'bg-[#16161a] border-[#2e2b38] text-[#5e6175]'
                          }`}
                        >
                          <span className="text-xs leading-none">{step.icon}</span>
                          <span className="truncate max-w-full">{step.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Completed Stamp & Verdict */}
                {status === 'completed' && (
                  <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-[#1c1b22] to-[#24222e] border border-emerald-700/40 flex items-start space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-900/40 border border-emerald-500/60 flex items-center justify-center text-emerald-300 shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-display text-emerald-400 font-semibold tracking-wider">
                          Аттестация утверждена
                        </span>
                        <span className="text-xs font-bold text-[#f3e29f]">
                          {modState.grade || 'Сдано'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#c5c6d0] italic font-serif-vintage line-clamp-2">
                        «{modState.verdict || 'Материал успешно сдан научному руководителю.'}»
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions Based on Current Status */}
                <div className="pt-2">
                  {status === 'not_started' && (
                    <button
                      onClick={() => {
                        startStudying(module.id);
                        setActiveNotesModule(module);
                      }}
                      disabled={isScoreLocked}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide border flex items-center justify-center space-x-2 active:scale-95 transition-all ${
                        isScoreLocked
                          ? 'bg-[#24222e] text-[#717388] border-[#3a3546] cursor-not-allowed'
                          : 'bg-[#24222e] hover:bg-[#2e2b38] text-[#fffffe] border-[#3a3546] hover:border-[#d4af37]/40 shadow-sm'
                      }`}
                    >
                      {isScoreLocked ? (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Требуется {module.min_score_required} баллов (у вас {score})</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>Приступить к изучению темы</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                        </>
                      )}
                    </button>
                  )}

                  {status === 'learning' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveNotesModule(module)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#c5c6d0] text-xs font-medium border border-[#3a3546] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>Открыть конспект</span>
                      </button>

                      <button
                        onClick={() => openCabinetWithModule(module.id)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-semibold border border-[#d4af37]/40 shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                      >
                        <span>✍️ Доложить</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#f3e29f]" />
                      </button>
                    </div>
                  )}

                  {status === 'ready_to_report' && (
                    <button
                      onClick={() => openCabinetWithModule(module.id)}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#722f37] via-[#8e3b45] to-[#4a1820] text-[#fffffe] text-xs font-bold tracking-wide border border-[#d4af37] shadow-[0_4px_16px_rgba(114,47,55,0.4)] active:scale-95 transition-all flex items-center justify-center space-x-2 animate-pulse"
                    >
                      <Sparkles className="w-4 h-4 text-[#f3e29f]" />
                      <span>✍️ ДОЛОЖИТЬ О ГОТОВНОСТИ МАТЕРИАЛА</span>
                      <ChevronRight className="w-4 h-4 text-[#f3e29f]" />
                    </button>
                  )}

                  {status === 'completed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveNotesModule(module)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#16161a] hover:bg-[#24222e] text-[#a7a9be] text-xs border border-[#2e2b38] active:scale-95 transition-all flex items-center justify-center space-x-1"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-[#a7a9be]" />
                        <span>Конспект темы</span>
                      </button>
                      <button
                        onClick={() => openCabinetWithModule(module.id)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#d4af37] text-xs font-medium border border-[#d4af37]/30 active:scale-95 transition-all flex items-center justify-center space-x-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Пересдать диалог</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal for study notes if open */}
      {activeNotesModule && (
        <StudyNotesModal
          module={activeNotesModule}
          onClose={() => setActiveNotesModule(null)}
        />
      )}
    </div>
  );
};
