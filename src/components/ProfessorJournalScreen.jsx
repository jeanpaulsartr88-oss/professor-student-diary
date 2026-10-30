import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AddModuleModal } from './AddModuleModal';
import {
  Landmark,
  UserCheck,
  AlertTriangle,
  Award,
  Sparkles,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Hourglass,
  Edit3,
  MapPin,
  FileText,
  CalendarPlus,
} from 'lucide-react';

export const ProfessorJournalScreen = () => {
  const {
    studentName,
    studentData,
    score,
    penalties,
    academicStatus,
    modulesState,
    scenarioData,
    openCabinetWithModule,
    professorChangePenalties,
    professorChangeScore,
    professorUpdateNotes,
    professorNotes,
  } = useApp();

  const [notesInput, setNotesInput] = useState(professorNotes || '');
  const [isSavedNotes, setIsSavedNotes] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleSaveNotes = (e) => {
    e.preventDefault();
    professorUpdateNotes(notesInput);
    setIsSavedNotes(true);
    setTimeout(() => setIsSavedNotes(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 max-w-lg mx-auto w-full pb-8">
      {/* Professor Desk Banner */}
      <div className="bg-[#1c1b22] border-2 border-[#722f37] rounded-2xl p-4 shadow-xl relative overflow-hidden space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
              КАФЕДРАЛЬНАЯ ВЕДОМОСТЬ
            </span>
          </div>
          <span className="text-[10px] text-[#a7a9be] font-serif-vintage italic">
            Кабинет № 305 • Зав. кафедрой
          </span>
        </div>

        <div>
          <h2 className="text-base font-bold font-serif-vintage text-[#fffffe] leading-tight">
            Надзор за дипломницей: {studentName}
          </h2>
          <p className="text-xs text-[#a7a9be] font-serif-vintage italic mt-0.5">
            Прием и разбор материалов — в личном чате Telegram. Здесь выставляются баллы, выносятся вердикты и утверждаются привилегии.
          </p>
        </div>

        {/* Quick Academic Governance Panel */}
        <div className="p-3 rounded-xl bg-[#16161a] border border-[#2e2b38] space-y-2.5">
          <span className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block">
            Административные рычаги профессора:
          </span>

          <div className="grid grid-cols-2 gap-2">
            {/* Penalties Management */}
            <div className="bg-[#24222e] p-2 rounded-xl border border-[#3a3546] space-y-1">
              <span className="text-[10px] text-[#a7a9be] flex items-center justify-between">
                <span>Отработки:</span>
                <strong className="text-red-400 font-bold">{penalties}</strong>
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => professorChangePenalties(1)}
                  className="flex-1 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 text-[10px] font-semibold border border-red-700/50 active:scale-95 transition-all flex items-center justify-center space-x-0.5"
                  title="Назначить внеплановую отработку за дерзость"
                >
                  <Plus className="w-3 h-3" />
                  <span>Наказать</span>
                </button>
                <button
                  onClick={() => professorChangePenalties(-1)}
                  disabled={penalties <= 0}
                  className="flex-1 py-1 rounded-lg bg-[#16161a] hover:bg-[#2e2b38] text-[#c5c6d0] text-[10px] border border-[#3a3546] active:scale-95 transition-all disabled:opacity-40"
                  title="Списать одну отработку за послушание"
                >
                  <Minus className="w-3 h-3" />
                  <span>Простить</span>
                </button>
              </div>
            </div>

            {/* Score Management */}
            <div className="bg-[#24222e] p-2 rounded-xl border border-[#3a3546] space-y-1">
              <span className="text-[10px] text-[#a7a9be] flex items-center justify-between">
                <span>Прилежание:</span>
                <strong className="text-[#f3e29f] font-bold">{score} / 100</strong>
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => professorChangeScore(5)}
                  className="flex-1 py-1 rounded-lg bg-[#722f37] hover:bg-[#8e3b45] text-[#fffffe] text-[10px] font-semibold border border-[#d4af37]/40 active:scale-95 transition-all flex items-center justify-center space-x-0.5"
                  title="Поощрить баллами за усердие"
                >
                  <Plus className="w-3 h-3" />
                  <span>+5 б.</span>
                </button>
                <button
                  onClick={() => professorChangeScore(-5)}
                  disabled={score <= 0}
                  className="flex-1 py-1 rounded-lg bg-[#16161a] hover:bg-[#2e2b38] text-[#c5c6d0] text-[10px] border border-[#3a3546] active:scale-95 transition-all disabled:opacity-40"
                  title="Снизить балл за невнимательность"
                >
                  <Minus className="w-3 h-3" />
                  <span>-5 б.</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modules to Examine */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs uppercase font-display tracking-wider text-[#d4af37]">
            АТТЕСТАЦИЯ ДИПЛОМНЫХ ЭТАПОВ
          </h3>
          <span className="text-[10px] text-[#a7a9be] italic font-serif-vintage">
            Очередь на ковер
          </span>
        </div>

        {/* Button to Add New Custom Module */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-bold border border-[#d4af37]/60 shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <CalendarPlus className="w-4 h-4 text-[#f3e29f]" />
          <span>+ Назначить новое занятие / модуль кафедры</span>
        </button>

        <div className="space-y-3">
          {scenarioData.modules.map((module) => {
            const modState = modulesState[module.id] || { status: 'not_started' };
            const status = modState.status;

            return (
              <div
                key={module.id}
                className={`rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden ${
                  status === 'ready_to_report'
                    ? 'bg-gradient-to-r from-[#1c1b22] to-[#2a1c22] border-[#d4af37] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : status === 'completed'
                    ? 'bg-[#1c1b22]/90 border-emerald-800/40'
                    : 'bg-[#1c1b22] border-[#2e2b38]'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center space-x-1.5 text-[10px] text-[#d4af37] font-semibold mb-0.5">
                      <span className="uppercase font-display">Этап {module.order}</span>
                      <span>•</span>
                      <span className="text-[#a7a9be]">{module.room}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#fffffe] font-serif-vintage leading-tight">
                      {module.title}
                    </h4>
                  </div>

                  {/* Status Pill */}
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      status === 'ready_to_report'
                        ? 'bg-[#722f37] text-[#f3e29f] border-[#d4af37] animate-pulse'
                        : status === 'completed'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-600/50'
                        : status === 'learning'
                        ? 'bg-amber-950/40 text-amber-300 border-amber-600/40'
                        : 'bg-[#24222e] text-[#8f90a6] border-[#3a3546]'
                    }`}
                  >
                    {status === 'ready_to_report'
                      ? '✍️ Ждет допроса'
                      : status === 'completed'
                      ? '🔒 Аттестовано'
                      : status === 'learning'
                      ? '📖 Учит тему'
                      : '⏳ Не начато'}
                  </span>
                </div>

                <p className="text-xs text-[#a7a9be] font-serif-vintage italic line-clamp-2 mb-3 bg-[#16161a] p-2 rounded-xl border border-[#2e2b38]/70">
                  {module.description}
                </p>

                {/* Professor Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openCabinetWithModule(module.id)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold tracking-wide border shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5 ${
                      status === 'ready_to_report'
                        ? 'bg-gradient-to-r from-[#722f37] to-[#8e3b45] text-[#fffffe] border-[#d4af37]'
                        : 'bg-[#24222e] hover:bg-[#2e2b38] text-[#f3e29f] border-[#3a3546]'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    <span>
                      {status === 'ready_to_report'
                        ? '🏛️ Вызвать студентку на опрос'
                        : status === 'completed'
                        ? 'Пересмотреть сдачу'
                        : 'Начать экзаменацию'}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Professor Secret Notebook */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-4 shadow-md space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-display tracking-wider text-[#d4af37] flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Личный дневник профессора:</span>
          </span>
          {isSavedNotes && (
            <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Сохранено</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveNotes} className="space-y-2">
          <textarea
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            rows={3}
            placeholder="Запишите ваши личные мысли о поведении и прилежании дипломницы..."
            className="w-full p-2.5 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs font-serif-vintage text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37] leading-relaxed resize-none"
          />
          <button
            type="submit"
            className="py-1.5 px-3 rounded-lg bg-[#722f37] hover:bg-[#8e3b45] text-[#fffffe] text-xs font-semibold border border-[#d4af37]/40 active:scale-95 transition-all"
          >
            Внести запись в архив кафедры
          </button>
        </form>
      </div>

      {/* Add Module Modal */}
      <AddModuleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
};
