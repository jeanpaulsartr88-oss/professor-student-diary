import React, { createContext, useContext, useState, useEffect } from 'react';
import scenarioData from '../data/scenario.json';
import rewardsData from '../data/rewards.json';
import { getTelegramUser, initTelegramApp, triggerHaptic } from '../utils/telegram';
import { sound } from '../utils/sound';

const AppContext = createContext(null);

const STORAGE_KEY = 'academic_quest_state_v1';

const getInitialModulesState = () => {
  const state = {};
  scenarioData.modules.forEach((mod) => {
    state[mod.id] = {
      status: mod.status || 'not_started',
      grade: null,
      verdict: null,
      scoreEarned: 0,
      completedAt: null,
    };
  });
  return state;
};

export const AppProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('journal'); // 'journal' | 'cabinet' | 'gradebook' | 'profile'
  const [currentModuleId, setCurrentModuleId] = useState('module_1');
  const [score, setScore] = useState(0);
  const [penalties, setPenalties] = useState(0);
  const [modulesState, setModulesState] = useState(getInitialModulesState);
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [studentName, setStudentName] = useState('Студентка');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [selectedStudyModule, setSelectedStudyModule] = useState(null);

  // Initialize Telegram & load from LocalStorage
  useEffect(() => {
    initTelegramApp();
    const tgUser = getTelegramUser();
    let initialName = tgUser.firstName || 'Студентка';

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.score === 'number') setScore(parsed.score);
        if (typeof parsed.penalties === 'number') setPenalties(parsed.penalties);
        if (parsed.modulesState) setModulesState(parsed.modulesState);
        if (Array.isArray(parsed.claimedRewards)) setClaimedRewards(parsed.claimedRewards);
        if (parsed.studentName) initialName = parsed.studentName;
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          sound.enabled = parsed.soundEnabled;
        }
        if (typeof parsed.hapticEnabled === 'boolean') setHapticEnabled(parsed.hapticEnabled);
        if (parsed.currentModuleId) setCurrentModuleId(parsed.currentModuleId);
      }
    } catch (e) {
      console.error('Failed to load saved state from localStorage:', e);
    }

    setStudentName(initialName);
    setIsLoaded(true);
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const stateToSave = {
        score,
        penalties,
        modulesState,
        claimedRewards,
        studentName,
        soundEnabled,
        hapticEnabled,
        currentModuleId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save state to localStorage:', e);
    }
  }, [score, penalties, modulesState, claimedRewards, studentName, soundEnabled, hapticEnabled, currentModuleId, isLoaded]);

  // Update sound controller when toggle changes
  useEffect(() => {
    sound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Actions
  const switchTab = (tab) => {
    triggerHaptic('selection', hapticEnabled);
    sound.playPageTurn();
    setActiveTab(tab);
  };

  const startStudying = (moduleId) => {
    triggerHaptic('light', hapticEnabled);
    sound.playClick();
    setModulesState((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        status: 'learning',
      },
    }));
  };

  const finishNotes = (moduleId) => {
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
    setModulesState((prev) => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        status: 'ready_to_report',
      },
    }));
  };

  const openCabinetWithModule = (moduleId) => {
    triggerHaptic('medium', hapticEnabled);
    sound.playClick();
    setCurrentModuleId(moduleId);
    setActiveTab('cabinet');
  };

  const completeModule = ({ moduleId, grade, verdict, scoreBonus, penaltiesAwarded, nextModuleId }) => {
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();

    setScore((prev) => Math.min(100, Math.max(0, prev + (scoreBonus || 0))));
    if (penaltiesAwarded) {
      setPenalties((prev) => prev + penaltiesAwarded);
    }

    setModulesState((prev) => {
      const nextState = {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          status: 'completed',
          grade,
          verdict,
          scoreEarned: (prev[moduleId]?.scoreEarned || 0) + (scoreBonus || 0),
          completedAt: new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      };

      // Unlock next module if available and not yet unlocked
      if (nextModuleId && nextState[nextModuleId]) {
        if (nextState[nextModuleId].status === 'not_started') {
          nextState[nextModuleId] = {
            ...nextState[nextModuleId],
            status: 'learning',
          };
        }
      }

      return nextState;
    });
  };

  const claimReward = (rewardId) => {
    if (claimedRewards.includes(rewardId)) return;
    triggerHaptic('success', hapticEnabled);
    sound.playChime();
    setClaimedRewards((prev) => [...prev, rewardId]);
  };

  const resetAllProgress = () => {
    triggerHaptic('warning', hapticEnabled);
    sound.playStamp();
    setScore(0);
    setPenalties(0);
    setModulesState(getInitialModulesState());
    setClaimedRewards([]);
    setCurrentModuleId('module_1');
    setActiveTab('journal');
    localStorage.removeItem(STORAGE_KEY);
  };

  // Academic status calculation
  let academicStatus = {
    title: 'Отчислена на ковер к профессору',
    level: 'danger',
    color: 'text-red-400',
    badge: 'На грани отчисления',
    description: 'Вам срочно требуется приватная аудиенция в кабинете научного руководителя.',
  };

  if (score >= 90) {
    academicStatus = {
      title: 'Любимая дипломница с отличием',
      level: 'royal',
      color: 'text-[#d4af37]',
      badge: 'Абсолютный триумф',
      description: 'Безоговорочный авторитет, личный ключ от кафедры и безграничное внимание научрука.',
    };
  } else if (score >= 60) {
    academicStatus = {
      title: 'Прилежная аспирантка с особыми привилегиями',
      level: 'high',
      color: 'text-amber-300',
      badge: 'Высшая лига',
      description: 'Профессор доверяет вам ключевые материалы и закрытые заседания.',
    };
  } else if (score >= 30) {
    academicStatus = {
      title: 'Условно допущена к закрытой аттестации',
      level: 'medium',
      color: 'text-emerald-400',
      badge: 'Аттестована',
      description: 'Вы на верном пути, но профессор пристально следит за каждым вашим шагом.',
    };
  }

  const value = {
    isLoaded,
    activeTab,
    setActiveTab: switchTab,
    currentModuleId,
    setCurrentModuleId,
    score,
    setScore,
    penalties,
    modulesState,
    claimedRewards,
    studentName,
    setStudentName,
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
    academicStatus,
    selectedStudyModule,
    setSelectedStudyModule,
    startStudying,
    finishNotes,
    openCabinetWithModule,
    completeModule,
    claimReward,
    resetAllProgress,
    scenarioData,
    rewardsData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
