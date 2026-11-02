import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound, Sparkles, Heart, GraduationCap, Award, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/sound';
import { triggerHaptic } from '../utils/telegram';

export const SecretLetterModal = ({ isOpen, onClose, hapticEnabled = true }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    try {
      return localStorage.getItem('academic_quest_secret_letter_v1') === 'true';
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    if (isOpen && isUnlocked) {
      fireLetterConfetti();
    }
  }, [isOpen, isUnlocked]);

  if (!isOpen) return null;

  const fireLetterConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#d4af37', '#722f37', '#ff69b4', '#ff1493', '#f3e29f'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    if (password.trim() === '26102026') {
      sound.playSuccess?.();
      triggerHaptic('success', hapticEnabled);
      setIsUnlocked(true);
      setError('');
      try {
        localStorage.setItem('academic_quest_secret_letter_v1', 'true');
      } catch (e) {
        // ignore
      }
      fireLetterConfetti();
    } else {
      sound.playError?.();
      triggerHaptic('error', hapticEnabled);
      setError('Шифр неверен. Сургучная печать остаётся нетронутой.');
    }
  };

  const handleResetLock = () => {
    setIsUnlocked(false);
    setPassword('');
    setError('');
    try {
      localStorage.removeItem('academic_quest_secret_letter_v1');
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] relative">
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-black/60 text-[#fffffe] hover:bg-black/90 flex items-center justify-center border border-[#d4af37]/40 active:scale-95 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {!isUnlocked ? (
          /* Password Prompt Modal */
          <div className="bg-[#1c1b22] border-2 border-[#d4af37]/60 rounded-2xl p-6 text-center space-y-4 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#722f37] to-[#16161a] border-2 border-[#d4af37] flex items-center justify-center text-[#f3e29f] shadow-lg">
              <GraduationCap className="w-8 h-8 text-[#f3e29f]" />
            </div>

            <div>
              <span className="text-[11px] uppercase font-display tracking-widest text-[#d4af37]">
                ТАЙНЫЙ АРХИВ АКАДЕМИИ
              </span>
              <h3 className="text-xl font-bold font-serif-vintage text-[#fffffe] mt-0.5">
                Выпускное послание кафедры
              </h3>
              <p className="text-xs text-[#a7a9be] mt-1 font-serif-vintage italic">
                Для вскрытия письма особого назначения требуется личный шифр дипломницы.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-3 pt-2">
              <div className="relative max-w-xs mx-auto">
                <KeyRound className="w-4 h-4 text-[#d4af37] absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Введите пароль-шифр"
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#16161a] border border-[#d4af37]/60 text-center text-sm font-bold tracking-widest text-[#fffffe] placeholder-[#717388] focus:outline-none focus:border-[#f3e29f] focus:ring-1 focus:ring-[#d4af37]"
                />
              </div>

              {error && (
                <p className="text-xs text-red-400 font-serif-vintage italic animate-shake">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="w-full max-w-xs mx-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#722f37] via-[#8e3b45] to-[#4a1820] text-[#fffffe] text-xs font-bold tracking-wider border border-[#d4af37] shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-[#f3e29f]" />
                <span>СЛОМАТЬ СУРГУЧНУЮ ПЕЧАТЬ</span>
              </button>
            </form>
          </div>
        ) : (
          /* Hogwarts Letter Visual View */
          <div className="overflow-y-auto bg-gradient-to-b from-[#fbf5e5] via-[#f7eed6] to-[#eee2c3] text-[#2c1d11] p-6 sm:p-8 border-4 border-double border-[#8b5a2b]/80 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] relative font-serif-vintage">
            {/* Background Hogwarts Watermark / Ornament */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)] pointer-events-none" />

            {/* Hogwarts Wax Seal Header */}
            <div className="text-center space-y-2 mb-6 relative">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#800000] via-[#5c0000] to-[#360000] border-2 border-[#d4af37] shadow-xl flex items-center justify-center text-[#f3e29f] relative group">
                <GraduationCap className="w-8 h-8 text-[#d4af37]" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#d4af37] text-[#800000] flex items-center justify-center text-[10px] font-bold shadow">
                  ★
                </div>
              </div>

              <div className="space-y-0.5">
                <h4 className="text-[13px] uppercase font-display tracking-[0.25em] text-[#5c1d1d] font-bold">
                  HOGWARTS SCHOOL OF ACADEMIC DEVOTION
                </h4>
                <p className="text-[11px] uppercase tracking-widest text-[#7a5230] font-sans font-semibold">
                  Высшая Кафедра Особого Назначения • Кабинет №305
                </p>
              </div>

              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#8b5a2b]/60 to-transparent mx-auto my-2" />
            </div>

            {/* Letter Salutation */}
            <div className="space-y-1 mb-5 text-sm sm:text-base leading-relaxed">
              <p className="font-bold text-[#4a2612] italic">
                Дорогая мисс Иза Любознательная,
              </p>
              <p className="text-xs text-[#704d2e] italic">
                Кафедра прикладного повиновения и дипломного наставничества.
              </p>
            </div>

            {/* The Special Core Message */}
            <div className="my-6 p-4 rounded-xl bg-[#5c1d1d]/10 border-2 border-[#800000]/40 text-center shadow-inner relative overflow-hidden">
              <div className="absolute -right-3 -bottom-3 text-red-500/10 pointer-events-none">
                <Heart className="w-24 h-24" />
              </div>
              
              <span className="text-[11px] uppercase font-display tracking-widest text-[#800000] font-bold block mb-1">
                ГЛАВНЫЙ ВЕРДИКТ НАУЧРУКА:
              </span>
              
              <div className="text-2xl sm:text-3xl font-bold font-serif-vintage text-[#6b1414] tracking-wide my-2 leading-snug drop-shadow-sm">
                ты лучшая ученица 💖 ❤️ 💗 💓 💞 💕 💘
              </div>

              <p className="text-xs sm:text-sm text-[#4a2612] italic mt-1 font-serif-vintage leading-relaxed">
                Настоящим письмом Совет кафедры удостоверяет, что ваше очарование, грация и безупречное прилежание признаны абсолютным триумфом за всю историю университета.
              </p>
            </div>

            {/* Letter Body in Elegant Prose */}
            <div className="space-y-3 text-xs sm:text-sm text-[#382315] leading-relaxed text-justify mb-6">
              <p>
                Ваши практические видео-этюды и рукописные тезисы навсегда вписаны золотыми чернилами в анналы закрытой профессорской библиотеки. Вы освобождаетесь от любых академических тревог, сомнений и формальных рамок.
              </p>
              <p>
                Все двери кафедры, малые библиотеки при свечах и загородные резиденции у ночного огня распахнуты перед вами в знак бесконечного восхищения и покровительства.
              </p>
            </div>

            {/* Signature & Seal */}
            <div className="flex items-end justify-between pt-3 border-t border-[#8b5a2b]/30">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-[#7a5230] font-bold block">
                  Гербовая печать:
                </span>
                <span className="text-xs font-bold text-[#800000] font-serif-vintage flex items-center space-x-1">
                  <span>Орден Золотой Конфедератки</span>
                </span>
              </div>

              <div className="text-right">
                <p className="text-xs text-[#704d2e] italic">С вечной нежностью и восхищением,</p>
                <p className="text-sm font-bold text-[#4a2612] font-serif-vintage">
                  Профессор Жунус Абаевич 🏛️✨
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center justify-between gap-3 pt-3">
              <button
                onClick={handleResetLock}
                className="text-[11px] text-[#704d2e] hover:text-[#2c1d11] underline active:scale-95 transition-all"
              >
                Закрыть шифром обратно
              </button>

              <button
                onClick={onClose}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#800000] to-[#5c1d1d] hover:from-[#9c1818] hover:to-[#732222] text-[#fff8ea] text-xs font-bold tracking-wider border border-[#d4af37] shadow-md active:scale-95 transition-all flex items-center space-x-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-[#ffb6c1] fill-current" />
                <span>Бережно сохранить у сердца</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
