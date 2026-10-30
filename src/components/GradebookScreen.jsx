import React from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Award,
  AlertTriangle,
  Lock,
  Unlock,
  Check,
  Sparkles,
  Coffee,
  Key,
  ShieldCheck,
  Wine,
  Crown,
  FileCheck,
  User,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GradebookScreen = () => {
  const {
    score,
    penalties,
    academicStatus,
    studentName,
    modulesState,
    scenarioData,
    rewardsData,
    claimedRewards,
    claimReward,
  } = useApp();

  const getRewardIcon = (iconName) => {
    switch (iconName) {
      case 'Coffee':
        return Coffee;
      case 'Key':
        return Key;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Wine':
        return Wine;
      case 'Crown':
        return Crown;
      default:
        return Sparkles;
    }
  };

  const handleClaim = (reward) => {
    claimReward(reward.id);
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#d4af37', '#f3e29f', '#722f37'],
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 max-w-lg mx-auto w-full pb-8">
      {/* Official Academic Gradebook Cover Card */}
      <div className="bg-[#1c1b22] border-2 border-[#d4af37]/60 rounded-2xl p-4 shadow-2xl relative overflow-hidden space-y-3.5">
        {/* Vintage gold watermark */}
        <div className="absolute -right-4 -bottom-4 w-28 h-28 border border-[#d4af37]/15 rounded-full flex items-center justify-center pointer-events-none">
          <GraduationCap className="w-16 h-16 text-[#d4af37]/10" />
        </div>

        {/* Top Header of Record Book */}
        <div className="text-center border-b border-[#2e2b38] pb-2.5">
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#d4af37] font-display tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>АКАДЕМИЧЕСКИЙ ТАБЕЛЬ СТУДЕНТКИ</span>
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
          </div>
          <h2 className="text-base font-bold font-serif-vintage text-[#fffffe] tracking-wider mt-0.5">
            ЗАЧЕТНАЯ КНИЖКА № 7024/А
          </h2>
          <p className="text-[10px] text-[#a7a9be] font-serif-vintage italic">
            Кафедра прикладного повиновения и романтической субординации
          </p>
        </div>

        {/* Student Dossier Information */}
        <div className="bg-[#16161a] p-3 rounded-xl border border-[#2e2b38] grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase text-[#717388] font-semibold block">
              Дипломница:
            </span>
            <span className="font-serif-vintage font-bold text-[#fffffe] truncate block">
              {studentName}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase text-[#717388] font-semibold block">
              Научный руководитель:
            </span>
            <span className="font-serif-vintage font-bold text-[#d4af37] truncate block">
              Проф. Жунус Абаевич
            </span>
          </div>
        </div>

        {/* Score & Penalties Academic Metrics */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a7a9be] font-medium flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Балл за прилежание:</span>
            </span>
            <span className="font-bold text-sm text-[#f3e29f] font-mono">
              {score} / 100
            </span>
          </div>

          {/* Animated Gold Progress Bar */}
          <div className="w-full h-2.5 bg-[#16161a] rounded-full overflow-hidden border border-[#2e2b38] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#722f37] via-[#d4af37] to-[#f3e29f] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              style={{ width: `${Math.min(100, score)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#a7a9be] flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#e57373]" />
              <span>Индивидуальные отработки:</span>
            </span>
            <span className="font-bold text-[#e57373] bg-[#722f37]/30 px-2 py-0.5 rounded-full border border-[#722f37]/50">
              {penalties} {penalties === 1 ? 'сессия' : penalties >= 2 && penalties <= 4 ? 'сессии' : 'сессий'}
            </span>
          </div>
        </div>

        {/* Academic Status Card */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#24222e] to-[#1c1b22] border border-[#d4af37]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-display text-[#d4af37] tracking-wider">
              Текущий академический статус:
            </span>
            <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold bg-black/40 ${academicStatus.color} border border-[#d4af37]/30`}>
              {academicStatus.badge}
            </span>
          </div>
          <h3 className={`text-sm font-bold font-serif-vintage ${academicStatus.color}`}>
            «{academicStatus.title}»
          </h3>
          <p className="text-[11px] text-[#a7a9be] italic font-serif-vintage">
            {academicStatus.description}
          </p>
        </div>

        {/* Modules Grade Table */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase font-display tracking-wider text-[#a7a9be]">
            Ведомость сданных модулей:
          </span>
          <div className="space-y-1">
            {scenarioData.modules.map((m) => {
              const state = modulesState[m.id];
              const isCompleted = state?.status === 'completed';

              return (
                <div
                  key={m.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#16161a] border border-[#2e2b38] text-xs"
                >
                  <div className="flex items-center space-x-2 truncate pr-2">
                    <span className="text-[10px] text-[#d4af37] font-bold">
                      #{m.order}
                    </span>
                    <span className="text-[#c5c6d0] truncate font-serif-vintage">
                      {m.title.replace(/^Модуль [I|V|X]+:\s*/, '')}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    {isCompleted ? (
                      <span className="text-[11px] font-bold text-[#f3e29f] font-serif-vintage">
                        {state.grade || 'Сдано'}
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#5e6175] italic">
                        Не сдано
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Secret Section: "Условия закрытия сессии" (Пикантные награды) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[#f3e29f]">
              УСЛОВИЯ ЗАКРЫТИЯ СЕССИИ
            </h3>
          </div>
          <span className="text-[10px] text-[#a7a9be] font-serif-vintage italic">
            Секретные награды
          </span>
        </div>

        <p className="text-xs text-[#a7a9be] font-serif-vintage italic leading-relaxed px-1">
          Набирайте баллы прилежания в диалогах с профессором, чтобы разблокировать реальные приватные соглашения и привилегии.
        </p>

        {/* Rewards List */}
        <div className="space-y-3">
          {rewardsData.map((reward) => {
            const isUnlocked = score >= reward.required_score;
            const isClaimed = claimedRewards.includes(reward.id);
            const Icon = getRewardIcon(reward.icon);

            return (
              <div
                key={reward.id}
                className={`rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden ${
                  isClaimed
                    ? 'bg-[#1c1b22]/70 border-emerald-600/40 opacity-90'
                    : isUnlocked
                    ? 'bg-gradient-to-br from-[#1c1b22] to-[#25202e] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                    : 'bg-[#16161a] border-[#2e2b38] opacity-75'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                        isClaimed
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                          : isUnlocked
                          ? 'bg-[#722f37] border-[#d4af37]/60 text-[#f3e29f]'
                          : 'bg-[#24222e] border-[#3a3546] text-[#717388]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-widest text-[#d4af37]">
                        {reward.category}
                      </span>
                      <h4 className="text-xs font-bold text-[#fffffe] font-serif-vintage leading-tight">
                        {reward.title}
                      </h4>
                    </div>
                  </div>

                  {/* Requirement Badge */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      isUnlocked
                        ? 'bg-[#d4af37]/20 text-[#f3e29f] border-[#d4af37]/50'
                        : 'bg-[#24222e] text-[#8f90a6] border-[#3a3546]'
                    }`}
                  >
                    {reward.required_score} баллов
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#c5c6d0] font-serif-vintage leading-relaxed mb-2.5">
                  {isUnlocked ? reward.description : 'Данное условие засекречено до достижения необходимого порога прилежания.'}
                </p>

                {/* Real-life perk info if unlocked */}
                {isUnlocked && (
                  <div className="p-2.5 rounded-xl bg-[#16161a] border border-[#d4af37]/30 text-xs font-serif-vintage text-[#f3e29f] mb-3 flex items-start space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>
                      <strong className="text-[#fffffe]">Обязательство научрука:</strong> {reward.real_life_perk}
                    </span>
                  </div>
                )}

                {/* Action button */}
                <div>
                  {isClaimed ? (
                    <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-emerald-950/40 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Привилегия востребована студенткой</span>
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleClaim(reward)}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-bold tracking-wide border border-[#d4af37] shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Unlock className="w-3.5 h-3.5 text-[#f3e29f]" />
                      <span>ВОСТРЕБОВАТЬ ПРИВИЛЕГИЮ</span>
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#16161a] border border-[#2e2b38] text-[#717388] text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Необходимо еще {reward.required_score - score} баллов</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
