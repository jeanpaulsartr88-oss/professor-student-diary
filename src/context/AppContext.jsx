import React, { createContext, useContext, useState, useEffect } from 'react';
import scenarioData from '../data/scenario.json';
import rewardsData from '../data/rewards.json';
import defaultAccounts from '../data/accounts.json';
import { getTelegramUser, initTelegramApp, triggerHaptic } from '../utils/telegram';
import { sound } from '../utils/sound';

const AppContext = createContext(null);

const STORAGE_USERS_KEY = 'academic_quest_users_v2';
const STORAGE_CURRENT_USER_KEY = 'academic_quest_current_user_v2';
const STORAGE_STUDENT_DATA_KEY = 'academic_quest_student_data_v2';
const STORAGE_SETTINGS_KEY = 'academic_quest_settings_v2';

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

const getInitialStudentData = () => ({
  score: 15,
  penalties: 1,
  modulesState: getInitialModulesState(),
  claimedRewards: [],
  approvedRewards: ['reward_1'], // Professor already signed first perk as a courtesy
  professorNotes: 'Дипломница Алиса проявляет острый ум и опасную склонность к дискуссиям наедине. Назначен повышенный надзор.',
});

export const AppProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Auth & Users
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return defaultAccounts;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default to student on first visit
    return defaultAccounts.find((u) => u.role === 'student') || null;
  });

  // Navigation
  const [activeTab, setActiveTab] = useState('journal'); // 'journal' | 'cabinet' | 'gradebook' | 'profile'
  const [currentModuleId, setCurrentModuleId] = useState('module_1');

  // Shared Student Academic Progress
  const [studentData, setStudentData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENT_DATA_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return getInitialStudentData();
  });

  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [selectedStudyModule, setSelectedStudyModule] = useState(null);

  // Initialize Telegram
  useEffect(() => {
    initTelegramApp();

    try {
      const savedSettings = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
          sound.enabled = parsed.soundEnabled;
        }
        if (typeof parsed.hapticEnabled === 'boolean') {
          setHapticEnabled(parsed.hapticEnabled);
        }
      }
    } catch (e) {
      // ignore
    }

    setIsLoaded(true);
  }, []);

  // Save Users
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  }, [users, isLoaded]);

  // Save Current User
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_CURRENT_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_CURRENT_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save current user:', e);
    }
  }, [currentUser, isLoaded]);

  // Save Student Progress
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_STUDENT_DATA_KEY, JSON.stringify(studentData));
    } catch (e) {
      console.error('Failed to save student data:', e);
    }
  }, [studentData, isLoaded]);

  // Save Settings
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(
        STORAGE_SETTINGS_KEY,
        JSON.stringify({ soundEnabled, hapticEnabled })
      );
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [soundEnabled, hapticEnabled, isLoaded]);

  // Tab switcher
  const switchTab = (tab) => {
    triggerHaptic('selection', hapticEnabled);
    sound.playPageTurn();
    setActiveTab(tab);
  };

  // Auth Operations
  const login = (loginOrUsername, password) => {
    const cleanLogin = loginOrUsername.trim().toLowerCase();
    const foundUser = users.find(
      (u) =>
        (u.login?.toLowerCase() === cleanLogin || u.username?.toLowerCase() === cleanLogin) &&
        u.password === password
    );

    if (foundUser) {
      setCurrentUser(foundUser);
      triggerHaptic('success', hapticEnabled);
      sound.playStamp();
      setActiveTab('journal');
      return { success: true, user: foundUser };
    }
    triggerHaptic('error', hapticEnabled);
    return { success: false, error: 'Неверный логин или академический пароль' };
  };

  const register = ({ name, login, password, role }) => {
    const cleanLogin = login.trim().toLowerCase();
    const existing = users.find(
      (u) => u.login?.toLowerCase() === cleanLogin || u.username?.toLowerCase() === cleanLogin
    );

    if (existing) {
      triggerHaptic('error', hapticEnabled);
      return { success: false, error: 'Пользователь с таким логином уже числится на кафедре' };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      login: cleanLogin,
      username: cleanLogin.split('@')[0],
      password,
      name: name.trim(),
      shortName: role === 'professor' ? `Проф. ${name.trim()}` : name.trim(),
      role: role || 'student',
      title:
        role === 'professor'
          ? 'Преподаватель кафедры прикладного повиновения'
          : 'Студентка, дипломница кафедры',
      department: 'Кафедра прикладного повиновения и академических искушений',
      cabinet: role === 'professor' ? 'Кабинет № 305' : 'Аудитория 402',
      avatar: role === 'professor' ? '🏛️' : '🥀',
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
    setActiveTab('journal');
    return { success: true, user: newUser };
  };

  const logout = () => {
    triggerHaptic('light', hapticEnabled);
    sound.playClick();
    setCurrentUser(null);
  };

  const switchAccountById = (id) => {
    const target = users.find((u) => u.id === id);
    if (target) {
      setCurrentUser(target);
      triggerHaptic('success', hapticEnabled);
      sound.playStamp();
      setActiveTab('journal');
    }
  };

  // Student Actions
  const startStudying = (moduleId) => {
    triggerHaptic('light', hapticEnabled);
    sound.playClick();
    setStudentData((prev) => ({
      ...prev,
      modulesState: {
        ...prev.modulesState,
        [moduleId]: {
          ...prev.modulesState[moduleId],
          status: 'learning',
        },
      },
    }));
  };

  const finishNotes = (moduleId) => {
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
    setStudentData((prev) => ({
      ...prev,
      modulesState: {
        ...prev.modulesState,
        [moduleId]: {
          ...prev.modulesState[moduleId],
          status: 'ready_to_report',
        },
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

    setStudentData((prev) => {
      const nextScore = Math.min(100, Math.max(0, prev.score + (scoreBonus || 0)));
      const nextPenalties = prev.penalties + (penaltiesAwarded || 0);

      const nextModulesState = {
        ...prev.modulesState,
        [moduleId]: {
          ...prev.modulesState[moduleId],
          status: 'completed',
          grade,
          verdict,
          scoreEarned: (prev.modulesState[moduleId]?.scoreEarned || 0) + (scoreBonus || 0),
          completedAt: new Date().toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit',
          }),
        },
      };

      if (nextModuleId && nextModulesState[nextModuleId]) {
        if (nextModulesState[nextModuleId].status === 'not_started') {
          nextModulesState[nextModuleId] = {
            ...nextModulesState[nextModuleId],
            status: 'learning',
          };
        }
      }

      return {
        ...prev,
        score: nextScore,
        penalties: nextPenalties,
        modulesState: nextModulesState,
      };
    });
  };

  const claimReward = (rewardId) => {
    if (studentData.claimedRewards.includes(rewardId)) return;
    triggerHaptic('success', hapticEnabled);
    sound.playChime();
    setStudentData((prev) => ({
      ...prev,
      claimedRewards: [...prev.claimedRewards, rewardId],
    }));
  };

  // Professor Actions
  const professorApproveReward = (rewardId) => {
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
    setStudentData((prev) => {
      const isAlready = prev.approvedRewards.includes(rewardId);
      const nextApproved = isAlready
        ? prev.approvedRewards.filter((id) => id !== rewardId)
        : [...prev.approvedRewards, rewardId];
      return {
        ...prev,
        approvedRewards: nextApproved,
      };
    });
  };

  const professorChangePenalties = (delta) => {
    triggerHaptic(delta > 0 ? 'warning' : 'success', hapticEnabled);
    sound.playStamp();
    setStudentData((prev) => ({
      ...prev,
      penalties: Math.max(0, prev.penalties + delta),
    }));
  };

  const professorChangeScore = (delta) => {
    triggerHaptic('success', hapticEnabled);
    sound.playClick();
    setStudentData((prev) => ({
      ...prev,
      score: Math.min(100, Math.max(0, prev.score + delta)),
    }));
  };

  const professorUpdateNotes = (notes) => {
    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
    setStudentData((prev) => ({
      ...prev,
      professorNotes: notes,
    }));
  };

  const resetAllProgress = () => {
    triggerHaptic('warning', hapticEnabled);
    sound.playStamp();
    setStudentData(getInitialStudentData());
    setCurrentModuleId('module_1');
    setActiveTab('journal');
  };

  // Academic status calculation for the student
  const score = studentData.score;
  let academicStatus = {
    title: 'Отчислена на ковер к профессору',
    level: 'danger',
    color: 'text-red-400',
    badge: 'На грани отчисления',
    description: 'Срочно требуется приватная аудиенция в кабинете научного руководителя.',
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
      description: 'Профессор доверяет вам ключевые закрытые материалы и заседания.',
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
    users,
    currentUser,
    login,
    register,
    logout,
    switchAccountById,
    activeTab,
    setActiveTab: switchTab,
    currentModuleId,
    setCurrentModuleId,
    // Shared Student data
    studentData,
    score: studentData.score,
    penalties: studentData.penalties,
    modulesState: studentData.modulesState,
    claimedRewards: studentData.claimedRewards,
    approvedRewards: studentData.approvedRewards,
    professorNotes: studentData.professorNotes,
    studentName:
      currentUser?.role === 'student'
        ? currentUser.name
        : users.find((u) => u.role === 'student')?.name || 'Алиса Воронова',
    // Student methods
    startStudying,
    finishNotes,
    openCabinetWithModule,
    completeModule,
    claimReward,
    // Professor methods
    professorApproveReward,
    professorChangePenalties,
    professorChangeScore,
    professorUpdateNotes,
    // Settings
    soundEnabled,
    setSoundEnabled,
    hapticEnabled,
    setHapticEnabled,
    academicStatus,
    selectedStudyModule,
    setSelectedStudyModule,
    resetAllProgress,
    scenarioData,
    rewardsData,
    defaultAccounts,
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
