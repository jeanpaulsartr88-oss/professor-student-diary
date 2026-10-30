import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, AlertTriangle, Feather, User } from 'lucide-react';

export const Header = () => {
  const { score, penalties, academicStatus, studentName, setActiveTab } = useApp();

  return (
    <header className="w-full bg-[#16161a]/95 backdrop-blur-md border-b border-[#2e2b38] px-4 py-2.5 flex items-center justify-between shrink-0 z-20">
      {/* Title & Student Name */}
      <div className="flex items-center space-x-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#722f37] to-[#4a1820] border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shadow-md">
          <Feather className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-1.5">
            <span className="font-display text-xs tracking-wider text-[#d4af37] font-semibold">
              ДНЕВНИК
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#722f37]/40 text-[#f3e29f] border border-[#722f37]">
              КВЕСТ
            </span>
          </div>
          <p className="text-[11px] text-[#a7a9be] font-serif-vintage italic truncate max-w-[140px]">
            {studentName}
          </p>
        </div>
      </div>

      {/* Stats Counter & Profile Button */}
      <div className="flex items-center space-x-2">
        {/* Score Pill */}
        <button
          onClick={() => setActiveTab('gradebook')}
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#1c1b22] border border-[#d4af37]/40 shadow-inner active:scale-95 transition-transform"
          title="Баллы прилежания"
        >
          <Award className="w-3.5 h-3.5 text-[#d4af37]" />
          <span className="text-xs font-bold text-[#f3e29f]">{score}</span>
          <span className="text-[10px] text-[#a7a9be]">/100</span>
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

        {/* Settings / Profile Button */}
        <button
          onClick={() => setActiveTab('profile')}
          className="w-8 h-8 rounded-full bg-[#1c1b22] border border-[#3a3546] hover:border-[#d4af37]/60 flex items-center justify-center text-[#a7a9be] hover:text-[#fffffe] active:scale-95 transition-colors"
          title="Досье и настройки"
        >
          <User className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
