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
  CheckCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ProfessorGradebookScreen = () => {
  const {
    score,
    penalties,
    academicStatus,
    studentName,
    modulesState,
    scenarioData,
    rewardsData,
    approvedRewards,
    professorApproveReward,
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

  const handleApprove = (rewardId) => {
    professorApproveReward(rewardId);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#722f37', '#f3e29f'],
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 max-w-lg mx-auto w-full pb-8">
      {/* Official Academic Gradebook Card */}
      <div className="bg-[#1c1b22] border-2 border-[#722f37] rounded-2xl p-4 shadow-2xl relative overflow-hidden space-y-3.5">
        <div className="text-center border-b border-[#2e2b38] pb-2.5">
          <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#d4af37] font-display tracking-widest uppercase">
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
            <span>ПРОФЕССОРСКИЙ НАДЗОРНЫЙ РЕЕСТР</span>
            <Sparkles className="w-3 h-3 text-[#d4af37]" />
          </div>
          <h2 className="text-base font-bold font-serif-vintage text-[#fffffe] tracking-wider mt-0.5">
            ЗАЧЕТНАЯ КНИЖКА № 7024/А
          </h2>
          <p className="text-[10px] text-[#a7a9be] font-serif-vintage italic">
            Дипломница: <strong className="text-[#fffffe]">{studentName}</strong> • Научрук: Проф. В. А. Северов
          </p>
        </div>

        {/* Academic Score & Disciplinary Stats */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#a7a9be] font-medium flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Текущее прилежание дипломницы:</span>
            </span>
            <span className="font-bold text-sm text-[#f3e29f] font-mono">
              {score} / 100
            </span>
          </div>

          <div className="w-full h-2.5 bg-[#16161a] rounded-full overflow-hidden border border-[#2e2b38] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#722f37] via-[#d4af37] to-[#f3e29f] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              style={{ width: `${Math.min(100, score)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-[#a7a9be] flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#e57373]" />
              <span>Назначено закрытых отработок:</span>
            </span>
            <span className="font-bold text-[#e57373] bg-[#722f37]/30 px-2 py-0.5 rounded-full border border-[#722f37]/50">
              {penalties}
            </span>
          </div>
        </div>

        {/* Current Academic Verdict */}
        <div className="p-3 rounded-xl bg-gradient-to-r from-[#24222e] to-[#1c1b22] border border-[#d4af37]/40 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-display text-[#d4af37] tracking-wider">
              Ваш вердикт по дипломнице:
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
      </div>

      {/* Secret Conditions Endorsement */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-ping" />
            <h3 className="text-sm font-bold font-display uppercase tracking-wider text-[#f3e29f]">
              ПРИВАТНЫЕ СОГЛАШЕНИЯ И ПРИВИЛЕГИИ
            </h3>
          </div>
          <span className="text-[10px] text-[#a7a9be] font-serif-vintage italic">
            Резолюции научрука
          </span>
        </div>

        <p className="text-xs text-[#a7a9be] font-serif-vintage italic leading-relaxed px-1">
          По достижении баллов студентка вправе претендовать на особые условия. Вы, как научный руководитель, лично утверждаете каждое соглашение.
        </p>

        <div className="space-y-3">
          {rewardsData.map((reward) => {
            const isUnlocked = score >= reward.required_score;
            const isApproved = approvedRewards.includes(reward.id);
            const Icon = getRewardIcon(reward.icon);

            return (
              <div
                key={reward.id}
                className={`rounded-2xl border p-4 transition-all duration-200 relative overflow-hidden ${
                  isApproved
                    ? 'bg-gradient-to-br from-[#1c1b22] to-[#251e2b] border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : isUnlocked
                    ? 'bg-[#1c1b22] border-[#722f37]'
                    : 'bg-[#16161a] border-[#2e2b38] opacity-75'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${
                        isApproved
                          ? 'bg-[#722f37] border-[#d4af37] text-[#f3e29f]'
                          : isUnlocked
                          ? 'bg-[#24222e] border-[#722f37] text-amber-300'
                          : 'bg-[#16161a] border-[#2e2b38] text-[#717388]'
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

                <p className="text-xs text-[#c5c6d0] font-serif-vintage leading-relaxed mb-2.5">
                  {reward.description}
                </p>

                <div className="p-2.5 rounded-xl bg-[#16161a] border border-[#2e2b38] text-xs font-serif-vintage text-[#a7a9be] mb-3">
                  <strong className="text-[#fffffe]">Ваше обязательство:</strong> {reward.real_life_perk}
                </div>

                {/* Professor Approval Action Button */}
                <div>
                  {isUnlocked ? (
                    <button
                      onClick={() => handleApprove(reward.id)}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold tracking-wide border shadow-md active:scale-95 transition-all flex items-center justify-center space-x-1.5 ${
                        isApproved
                          ? 'bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border-emerald-500/60'
                          : 'bg-gradient-to-r from-[#722f37] to-[#8e3b45] text-[#fffffe] border-[#d4af37]'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-emerald-400" />
                          <span>УТВЕРЖДЕНО НАУЧРУКОМ (ОТОЗВАТЬ)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-[#f3e29f]" />
                          <span>ПОДПИСАТЬ СОГЛАШЕНИЕ С ДИПЛОМНИЦЕЙ</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-[#16161a] border border-[#2e2b38] text-[#717388] text-xs">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Дипломнице не хватает {reward.required_score - score} баллов</span>
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
