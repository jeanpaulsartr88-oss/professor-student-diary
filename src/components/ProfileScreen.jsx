import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';
import { sound } from '../utils/sound';
import {
  User,
  Volume2,
  VolumeX,
  Vibrate,
  RotateCcw,
  Shield,
  HelpCircle,
  ExternalLink,
  Check,
  Feather,
} from 'lucide-react';

export const ProfileScreen = () => {
  const {
    studentName,
    setStudentName,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
    resetAllProgress,
    academicStatus,
    score,
    penalties,
  } = useApp();

  const [nameInput, setNameInput] = useState(studentName);
  const [isSaved, setIsSaved] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveName = (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setStudentName(nameInput.trim());
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) sound.playClick();
    triggerHaptic('selection', hapticEnabled);
  };

  const handleToggleHaptic = () => {
    const next = !hapticEnabled;
    setHapticEnabled(next);
    if (next) triggerHaptic('success', true);
  };

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetConfirm(false);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 max-w-lg mx-auto w-full pb-8">
      {/* Dossier Header Card */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#722f37] to-[#4a1820] border-2 border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] shadow-md shrink-0">
            <Feather className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
              ЛИЧНОЕ ДЕЛО ДИПЛОМНИЦЫ
            </span>
            <h2 className="text-base font-bold text-[#fffffe] font-serif-vintage truncate">
              {studentName}
            </h2>
            <p className="text-xs text-[#a7a9be] font-serif-vintage italic truncate">
              Статус: {academicStatus.title}
            </p>
          </div>
        </div>

        {/* Change Name Form */}
        <form onSubmit={handleSaveName} className="space-y-1.5 pt-1">
          <label className="text-[10px] uppercase text-[#a7a9be] font-semibold tracking-wider block">
            Имя студентки для обращений профессора:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Введите ваше имя"
              maxLength={24}
              className="flex-1 px-3 py-2 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#d4af37]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#722f37] hover:bg-[#8e3b45] text-[#fffffe] text-xs font-semibold border border-[#d4af37]/40 active:scale-95 transition-all flex items-center justify-center space-x-1"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-400" /> : <span>Записать</span>}
            </button>
          </div>
        </form>
      </div>

      {/* Settings Options */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs uppercase font-display tracking-wider text-[#d4af37]">
          НАСТРОЙКИ СЕССИИ
        </h3>

        <div className="space-y-2">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161a] border border-[#2e2b38]">
            <div className="flex items-center space-x-2.5">
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-[#d4af37]" />
              ) : (
                <VolumeX className="w-4 h-4 text-[#717388]" />
              )}
              <div>
                <span className="text-xs font-semibold text-[#fffffe] block">
                  Звуковые эффекты
                </span>
                <span className="text-[10px] text-[#a7a9be]">
                  Перо, печати, колокольчик
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleSound}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#722f37]' : 'bg-[#2e2b38]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Feedback Toggle */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#16161a] border border-[#2e2b38]">
            <div className="flex items-center space-x-2.5">
              <Vibrate className="w-4 h-4 text-[#d4af37]" />
              <div>
                <span className="text-xs font-semibold text-[#fffffe] block">
                  Виброотклик (Haptic Feedback)
                </span>
                <span className="text-[10px] text-[#a7a9be]">
                  Тактильная отдача в Telegram
                </span>
              </div>
            </div>

            <button
              onClick={handleToggleHaptic}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                hapticEnabled ? 'bg-[#722f37]' : 'bg-[#2e2b38]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  hapticEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* About Quest & Rules */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-4 shadow-md space-y-2">
        <h3 className="text-xs uppercase font-display tracking-wider text-[#d4af37] flex items-center space-x-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>О КВЕСТЕ И ПРАВИЛАХ</span>
        </h3>
        <p className="text-xs text-[#a7a9be] font-serif-vintage italic leading-relaxed">
          «Дневник преподавателя и его студенточки» — это детерминированный текстовый квест в жанре Dark Academia. Все ветвления сценария зависят исключительно от ваших ответов. Чем выше балл прилежания, тем более сокровенные награды открываются в вашей зачетной книжке.
        </p>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="bg-[#1c1b22] border border-red-950/60 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs uppercase font-display tracking-wider text-red-400 flex items-center space-x-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>СБРОС ПРОГРЕССА</span>
        </h3>
        <p className="text-xs text-[#8f90a6]">
          Очистить все набранные баллы, сданные модули и востребованные награды.
        </p>

        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl bg-red-950/30 hover:bg-red-950/60 text-red-300 text-xs font-semibold border border-red-800/40 active:scale-95 transition-all"
          >
            Сбросить академический прогресс
          </button>
        ) : (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-600/60 space-y-2">
            <span className="text-xs text-red-200 font-bold block text-center">
              Вы уверены? Это сотрет все записи в зачетке!
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold active:scale-95 transition-all"
              >
                Да, начать сначала
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg bg-[#24222e] text-[#c5c6d0] text-xs font-medium active:scale-95 transition-all"
              >
                Отмена
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
