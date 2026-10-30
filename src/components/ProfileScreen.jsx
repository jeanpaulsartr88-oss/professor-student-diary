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
  LogOut,
  HelpCircle,
  Check,
  Feather,
  ArrowLeftRight,
  Shield,
} from 'lucide-react';

export const ProfileScreen = () => {
  const {
    currentUser,
    users,
    switchAccountById,
    logout,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
    resetAllProgress,
    academicStatus,
  } = useApp();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const isProfessor = currentUser?.role === 'professor';

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
      {/* Current Active Account Card */}
      <div className="bg-[#1c1b22] border-2 border-[#d4af37]/50 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#722f37] to-[#4a1820] border-2 border-[#d4af37] flex items-center justify-center text-xl shadow-md shrink-0">
            {currentUser?.avatar || (isProfessor ? '🏛️' : '🥀')}
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
              {isProfessor ? 'ЛИЧНОЕ ДЕЛО НАУЧРУКА' : 'ЛИЧНОЕ ДЕЛО ДИПЛОМНИЦЫ'}
            </span>
            <h2 className="text-base font-bold text-[#fffffe] font-serif-vintage truncate">
              {currentUser?.name}
            </h2>
            <p className="text-xs text-[#a7a9be] font-serif-vintage italic truncate">
              {currentUser?.title}
            </p>
          </div>
        </div>

        <div className="bg-[#16161a] p-3 rounded-xl border border-[#2e2b38] space-y-1 text-xs">
          <div className="flex justify-between text-[#a7a9be]">
            <span>Логин / Email:</span>
            <span className="text-[#fffffe] font-mono">{currentUser?.login}</span>
          </div>
          <div className="flex justify-between text-[#a7a9be]">
            <span>Кабинет / Аудитория:</span>
            <span className="text-[#d4af37]">{currentUser?.cabinet || 'Кафедра'}</span>
          </div>
        </div>

        {/* Logout / Switch Account Button */}
        <button
          onClick={logout}
          className="w-full py-2.5 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#c5c6d0] hover:text-[#fffffe] text-xs font-semibold border border-[#3a3546] active:scale-95 transition-all flex items-center justify-center space-x-1.5"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>Сменить аккаунт / Выйти в окно регистрации</span>
        </button>
      </div>

      {/* Switch between preloaded accounts */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-4 shadow-md space-y-2.5">
        <h3 className="text-xs uppercase font-display tracking-wider text-[#d4af37] flex items-center space-x-1.5">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>БЫСТРОЕ ПЕРЕКЛЮЧЕНИЕ РОЛЕЙ</span>
        </h3>
        <p className="text-xs text-[#a7a9be] font-serif-vintage italic">
          Переключайтесь между взглядом научрука и дипломницы для тестирования:
        </p>

        <div className="space-y-2 pt-1">
          {users.map((u) => {
            const isCurrent = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => switchAccountById(u.id)}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all active:scale-[0.98] ${
                  isCurrent
                    ? 'bg-[#722f37]/40 border-[#d4af37] shadow-sm'
                    : 'bg-[#16161a] border-[#2e2b38] hover:border-[#3a3546]'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <span className="text-sm">{u.avatar || '👤'}</span>
                  <div className="truncate">
                    <span className="font-bold text-[#fffffe] block truncate font-serif-vintage">
                      {u.name}
                    </span>
                    <span className="text-[10px] text-[#a7a9be] italic block truncate">
                      {u.role === 'professor' ? 'Преподаватель' : 'Студентка'} • {u.login}
                    </span>
                  </div>
                </div>

                {isCurrent && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#d4af37]/20 text-[#f3e29f] border border-[#d4af37]/40 shrink-0">
                    Активен
                  </span>
                )}
              </button>
            );
          })}
        </div>
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

      {/* Danger Zone: Reset Progress */}
      <div className="bg-[#1c1b22] border border-red-950/60 rounded-2xl p-4 shadow-md space-y-3">
        <h3 className="text-xs uppercase font-display tracking-wider text-red-400 flex items-center space-x-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          <span>СБРОС ПРОГРЕССА СЕССИИ</span>
        </h3>
        <p className="text-xs text-[#8f90a6]">
          Очистить все баллы, сданные модули и востребованные награды.
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
              Вы уверены? Это сотрет все записи в табеле!
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
