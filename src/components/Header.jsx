import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, AlertTriangle, Feather, User, LogOut, ArrowLeftRight } from 'lucide-react';

export const Header = () => {
  const {
    currentUser,
    score,
    penalties,
    setActiveTab,
    users,
    switchAccountById,
    logout,
  } = useApp();

  const isProfessor = currentUser?.role === 'professor';

  // Toggle to other role quickly
  const handleQuickSwitchRole = () => {
    const targetRole = isProfessor ? 'student' : 'professor';
    const targetUser = users.find((u) => u.role === targetRole);
    if (targetUser) {
      switchAccountById(targetUser.id);
    }
  };

  return (
    <header className="w-full bg-[#16161a]/95 backdrop-blur-md border-b border-[#2e2b38] px-3.5 py-2.5 flex items-center justify-between shrink-0 z-20">
      {/* Title & User Role Information */}
      <div className="flex items-center space-x-2.5">
        <div
          className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm shadow-md shrink-0 ${
            isProfessor
              ? 'bg-[#722f37] border-[#d4af37]/60 text-[#f3e29f]'
              : 'bg-gradient-to-br from-[#722f37] to-[#4a1820] border-[#d4af37]/40 text-[#d4af37]'
          }`}
        >
          {currentUser?.avatar || (isProfessor ? '🏛️' : '🥀')}
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="font-display text-[11px] tracking-wider text-[#d4af37] font-semibold">
              {isProfessor ? 'НАУЧРУК' : 'ДИПЛОМНИЦА'}
            </span>
            <span
              className={`text-[9px] px-1.5 py-0.2 rounded border uppercase font-bold tracking-tight ${
                isProfessor
                  ? 'bg-[#722f37]/40 text-[#f3e29f] border-[#722f37]'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40'
              }`}
            >
              {isProfessor ? 'Кабинет №305' : '4 курс'}
            </span>
          </div>
          <p className="text-[11px] text-[#a7a9be] font-serif-vintage italic truncate max-w-[140px]">
            {currentUser?.shortName || currentUser?.name || 'Пользователь'}
          </p>
        </div>
      </div>

      {/* Stats Counter & Controls */}
      <div className="flex items-center space-x-1.5">
        {/* Score Pill */}
        <button
          onClick={() => setActiveTab('gradebook')}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#1c1b22] border border-[#d4af37]/40 shadow-inner active:scale-95 transition-transform"
          title="Баллы прилежания дипломницы"
        >
          <Award className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-xs font-bold text-[#f3e29f]">{score}</span>
          <span className="text-[9px] text-[#a7a9be]">/100</span>
        </button>

        {/* Penalties Pill */}
        <button
          onClick={() => setActiveTab('gradebook')}
          className="flex items-center space-x-1 px-2 py-1 rounded-full bg-[#1c1b22] border border-[#722f37]/50 active:scale-95 transition-transform"
          title="Индивидуальные отработки"
        >
          <AlertTriangle className="w-3 h-3 text-[#e57373]" />
          <span className="text-xs font-semibold text-[#e57373]">{penalties}</span>
        </button>

        {/* Quick Switch Role Button */}
        <button
          onClick={handleQuickSwitchRole}
          className="w-8 h-8 rounded-full bg-[#1c1b22] border border-[#3a3546] hover:border-[#d4af37]/60 flex items-center justify-center text-[#d4af37] active:scale-95 transition-all"
          title={`Переключить на роль: ${isProfessor ? 'Студентка' : 'Преподаватель'}`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
        </button>

        {/* Profile / Dossier Button */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full bg-[#1c1b22] border border-[#3a3546] hover:border-[#d4af37]/60 flex items-center justify-center text-[#a7a9be] hover:text-[#fffffe] active:scale-95 transition-colors"
          title="Досье и настройки"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Logout to Registration / Auth Screen */}
        <button
          onClick={logout}
          className="w-8 h-8 rounded-full bg-[#1c1b22] border border-[#722f37]/70 hover:border-red-500/80 flex items-center justify-center text-red-400 hover:text-red-300 active:scale-95 transition-all"
          title="Выйти в окно авторизации и регистрации"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
