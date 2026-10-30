import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Landmark, GraduationCap, Settings } from 'lucide-react';

export const BottomNav = () => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    modulesState,
    score,
    claimedRewards,
    approvedRewards,
    rewardsData,
  } = useApp();

  const isProfessor = currentUser?.role === 'professor';

  // Check if any module is ready to report
  const hasReadyModule = Object.values(modulesState).some(
    (m) => m.status === 'ready_to_report'
  );

  // Check if any reward can be claimed by student or approved by professor
  const hasUnclaimedReward = rewardsData.some(
    (r) => score >= r.required_score && !claimedRewards.includes(r.id)
  );

  const hasUnapprovedReward = rewardsData.some(
    (r) => score >= r.required_score && !approvedRewards.includes(r.id)
  );

  const navItems = [
    {
      id: 'journal',
      label: isProfessor ? 'Ведомость' : 'Журнал',
      icon: BookOpen,
      badge: null,
    },
    {
      id: 'cabinet',
      label: isProfessor ? 'Экзамен' : 'Кабинет',
      icon: Landmark,
      badge: hasReadyModule ? (isProfessor ? 'вызов' : 'готов') : null,
      badgeColor: 'bg-[#722f37] text-[#f3e29f]',
    },
    {
      id: 'gradebook',
      label: isProfessor ? 'Резолюции' : 'Зачетка',
      icon: GraduationCap,
      badge: isProfessor
        ? hasUnapprovedReward
          ? '★'
          : null
        : hasUnclaimedReward
        ? '★'
        : null,
      badgeColor: 'bg-[#d4af37] text-[#16161a]',
    },
    {
      id: 'profile',
      label: 'Досье',
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <nav className="w-full bg-[#16161a]/95 backdrop-blur-md border-t border-[#2e2b38] px-3 py-1.5 shrink-0 z-20 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
                isActive
                  ? 'text-[#f3e29f]'
                  : 'text-[#8f90a6] hover:text-[#c5c6d0]'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 w-8 h-0.5 bg-[#d4af37] rounded-full shadow-[0_0_8px_#d4af37]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-[#d4af37]' : ''
                  }`}
                />
                {item.badge && (
                  <span
                    className={`absolute -top-1.5 -right-3 text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm animate-pulse ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] mt-1 tracking-tight font-medium ${
                  isActive ? 'text-[#fffffe] font-semibold' : 'text-[#8f90a6]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
