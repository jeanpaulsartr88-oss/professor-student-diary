import React, { createContext, useContext, useState, useEffect } from 'react';
import scenarioDataDefault from '../data/scenario.json';
import rewardsData from '../data/rewards.json';
import defaultAccounts from '../data/accounts.json';
import { getTelegramUser, initTelegramApp, triggerHaptic } from '../utils/telegram';
import { sound } from '../utils/sound';

const AppContext = createContext(null);

const STORAGE_USERS_KEY = 'academic_quest_users_v9';
const STORAGE_CURRENT_USER_KEY = 'academic_quest_current_user_v9';
const STORAGE_STUDENT_DATA_KEY = 'academic_quest_student_data_v9';
const STORAGE_MODULES_KEY = 'academic_quest_modules_v9';
const STORAGE_SETTINGS_KEY = 'academic_quest_settings_v9';

const getInitialModulesState = (modules) => {
  const state = {};
  modules.forEach((mod) => {
    if (mod.id === 'module_1') {
      state[mod.id] = {
        status: 'completed',
        grade: '100 баллов (Отлично с отличием)',
        verdict: 'Визуальный трактат студентки Изы признан образцом пластической гармонии. Профессор Жунус Абаевич зафиксировал идеальное следование канонам эстетической субординации и абсолютное доверие научному руководству.',
        scoreEarned: 100,
        completedAt: 'Этап I сдан (100 б.)',
      };
    } else if (mod.id === 'module_2') {
      state[mod.id] = {
        status: 'completed',
        grade: '100 баллов (Отлично с отличием)',
        verdict: 'Рукописный конспект первоисточников в полумраке аудитории №402 принят с наивысшим баллом (100/100). Продемонстрировано безупречное смирение, преодоление трепета перед наставником и готовность к полному растворению формальной дистанции в Малой библиотеке.',
        scoreEarned: 100,
        completedAt: 'Этап II сдан (100 б.)',
      };
    } else if (mod.id === 'module_3') {
      state[mod.id] = {
        status: 'completed',
        grade: '110 баллов (Абсолютный триумф с отличием)',
        verdict: 'Фееричный диптих ночного коллокиума (развёрнутый кинематографичный видео-трактат пластики и сокровенный видео-кружок тет-а-тет) признан шедевром кафедры. Профессор Жунус Абаевич безоговорочно покорён искренностью дипломницы Изы. Присуждены рекордные 110 баллов и открыт допуск к Предзащите диплома!',
        scoreEarned: 110,
        completedAt: 'Этап III сдан (110 б.)',
      };
    } else if (mod.id === 'module_4') {
      state[mod.id] = {
        status: 'completed',
        grade: '150 баллов (Высший триумф кафедры)',
        verdict: 'Академический триптих дипломницы Изы (два вертикальных этюда целомудренной пластики и горизонтальная панорама на шелках) признан венцом дипломного курса. Профессор Жунус Абаевич полностью покорён преданностью и смелостью музы. Присуждены рекордные 150 баллов кафедры и открыт доступ к Финальной аттестации!',
        scoreEarned: 150,
        completedAt: 'Этап IV сдан (150 б.)',
      };
    } else if (mod.id === 'module_5') {
      state[mod.id] = {
        status: 'completed',
        grade: '1000 баллов (Абсолютный триумф • Сверхзачет)',
        verdict: 'Беспрецедентная аттестация на рекордную 1000 баллов! Дипломница Иза явила себя во всем блеске непревзойденной красоты и эстетического великолепия. Профессор Жунус Абаевич констатирует полнейшую ультра- и сверхудовлетворенность кафедры ее смелостью, безупречной пластикой и трепетной преданностью наставнику. По обоюдному согласию сторон сессия закрыта навечно, а обучение кафедры решено продолжить на углубленной приватной программе!',
        scoreEarned: 1000,
        completedAt: 'Финальный триумф (1000 б.)',
      };
    } else {
      state[mod.id] = {
        status: 'not_started',
        grade: null,
        verdict: null,
        scoreEarned: 0,
        completedAt: null,
      };
    }
  });
  return state;
};

const getInitialStudentData = (modules) => ({
  score: 1460,
  penalties: 0,
  modulesState: getInitialModulesState(modules),
  claimedRewards: ['reward_1', 'reward_2', 'reward_3', 'reward_4', 'reward_5'],
  approvedRewards: ['reward_1', 'reward_2', 'reward_3', 'reward_4', 'reward_5'],
  professorNotes: 'Дипломница Иза Любознательная триумфально завершила Модуль V на рекордные 1000 баллов (общий счет кафедры: 1460 баллов)! Научный руководитель Жунус Абаевич официально констатирует предельную ультра- и сверхудовлетворенность кафедры: студентка раскрыла истинное эстетическое совершенство, доверие и абсолютную преданность. По совместному решению профессора и его музы базовый курс закрыт с отличием, а обучение кафедры продолжится на высшей программе индивидуального наставничества!',
});

export const AppProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Modules List (dynamically extensible by Professor)
  const [modulesList, setModulesList] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MODULES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return scenarioDataDefault.modules;
  });

  // Auth & Users
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const updated = parsed.map((u) => {
          const matchDefault = defaultAccounts.find((d) => d.id === u.id);
          if (matchDefault) return { ...u, ...matchDefault };
          return u;
        });
        return updated;
      }
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
    return null;
  });

  // Navigation
  const [activeTab, setActiveTab] = useState('journal');
  const [currentModuleId, setCurrentModuleId] = useState('module_5');

  // Shared Student Academic Progress
  const [studentData, setStudentData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STUDENT_DATA_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed.modulesState?.['module_1']?.status !== 'completed' ||
          parsed.modulesState?.['module_2']?.status !== 'completed' ||
          parsed.modulesState?.['module_3']?.status !== 'completed' ||
          parsed.modulesState?.['module_4']?.status !== 'completed' ||
          parsed.modulesState?.['module_5']?.status !== 'completed' ||
          parsed.modulesState?.['module_5']?.scoreEarned !== 1000
        ) {
          parsed.modulesState = parsed.modulesState || {};
          parsed.modulesState['module_1'] = {
            status: 'completed',
            grade: '100 баллов (Отлично с отличием)',
            verdict: 'Визуальный трактат студентки Изы признан образцом пластической гармонии. Профессор Жунус Абаевич зафиксировал идеальное следование канонам эстетической субординации и абсолютное доверие научному руководству.',
            scoreEarned: 100,
            completedAt: 'Этап I сдан (100 б.)',
          };
          parsed.modulesState['module_2'] = {
            status: 'completed',
            grade: '100 баллов (Отлично с отличием)',
            verdict: 'Рукописный конспект первоисточников в полумраке аудитории №402 принят с наивысшим баллом (100/100). Продемонстрировано безупречное смирение, преодоление трепета перед наставником и готовность к полному растворению формальной дистанции в Малой библиотеке.',
            scoreEarned: 100,
            completedAt: 'Этап II сдан (100 б.)',
          };
          parsed.modulesState['module_3'] = {
            status: 'completed',
            grade: '110 баллов (Абсолютный триумф с отличием)',
            verdict: 'Фееричный диптих ночного коллокиума (развёрнутый кинематографичный видео-трактат пластики и сокровенный видео-кружок тет-а-тет) признан шедевром кафедры. Профессор Жунус Абаевич безоговорочно покорён искренностью дипломницы Изы. Присуждены рекордные 110 баллов и открыт допуск к Предзащите диплома!',
            scoreEarned: 110,
            completedAt: 'Этап III сдан (110 б.)',
          };
          parsed.modulesState['module_4'] = {
            status: 'completed',
            grade: '150 баллов (Высший триумф кафедры)',
            verdict: 'Академический триптих дипломницы Изы (два вертикальных этюда целомудренной пластики и горизонтальная панорама на шелках) признан венцом дипломного курса. Профессор Жунус Абаевич полностью покорён преданностью и смелостью музы. Присуждены рекордные 150 баллов кафедры и открыт доступ к Финальной аттестации!',
            scoreEarned: 150,
            completedAt: 'Этап IV сдан (150 б.)',
          };
          parsed.modulesState['module_5'] = {
            status: 'completed',
            grade: '1000 баллов (Абсолютный триумф • Сверхзачет)',
            verdict: 'Беспрецедентная аттестация на рекордную 1000 баллов! Дипломница Иза явила себя во всем блеске непревзойденной красоты и эстетического великолепия. Профессор Жунус Абаевич констатирует полнейшую ультра- и сверхудовлетворенность кафедры ее смелостью, безупречной пластикой и трепетной преданностью наставнику. По обоюдному согласию сторон сессия закрыта навечно, а обучение кафедры решено продолжить на углубленной приватной программе!',
            scoreEarned: 1000,
            completedAt: 'Финальный триумф (1000 б.)',
          };
          parsed.score = Math.max(1460, parsed.score || 0);
          parsed.claimedRewards = ['reward_1', 'reward_2', 'reward_3', 'reward_4', 'reward_5'];
          parsed.approvedRewards = ['reward_1', 'reward_2', 'reward_3', 'reward_4', 'reward_5'];
          parsed.professorNotes = 'Дипломница Иза Любознательная триумфально завершила Модуль V на рекордные 1000 баллов (общий счет кафедры: 1460 баллов)! Научный руководитель Жунус Абаевич официально констатирует предельную ультра- и сверхудовлетворенность кафедры: студентка раскрыла истинное эстетическое совершенство, доверие и абсолютную преданность. По совместному решению профессора и его музы базовый курс закрыт с отличием, а обучение кафедры продолжится на высшей программе индивидуального наставничества!';
        }
        return parsed;
      }
    } catch (e) {
      // ignore
    }
    return getInitialStudentData(scenarioDataDefault.modules);
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

  // Save Modules
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_MODULES_KEY, JSON.stringify(modulesList));
    } catch (e) {
      console.error('Failed to save modules:', e);
    }
  }, [modulesList, isLoaded]);

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
    const cleanPass = password.trim();
    const foundUser = users.find(
      (u) =>
        (u.login?.toLowerCase() === cleanLogin ||
          u.username?.toLowerCase() === cleanLogin ||
          (Array.isArray(u.aliases) && u.aliases.some((a) => a.toLowerCase() === cleanLogin))) &&
        (u.password === cleanPass ||
          (u.role === 'professor' && (cleanPass === 'veritas123' || cleanPass === 'zhunus123')) ||
          (u.role === 'student' && (cleanPass === 'student123' || cleanPass === 'iza123')))
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

  // Dynamically add a new Module by Professor
  const addNewModule = ({ title, subtitle, room, description, notes, minScore }) => {
    const newId = `module_${modulesList.length + 1}`;
    const newOrder = modulesList.length + 1;
    const newModule = {
      id: newId,
      order: newOrder,
      title: title || `Модуль ${newOrder}: Специальный опрос`,
      subtitle: subtitle || 'Индивидуальная практическая сдача',
      room: room || 'Кабинет № 305',
      description: description || 'Специальное занятие, назначенное профессором Жунусом Абаевичем.',
      notes: notes || 'Критерии оценивания: полнота выполнения практических указаний научрука, искренность и послушание.',
      status: 'learning',
      min_score_required: typeof minScore === 'number' ? minScore : 50,
      max_score: 25,
      dialog_tree: {
        start_node: 'q1',
        nodes: {
          q1: {
            professor_speech: `Студентка Иза, вы явились на занятие №${newOrder}. Я изучил ваши предыдущие материалы. Готовы ли вы ответить перед кафедрой?`,
            professor_mood: 'Строгий цензор',
            action_hint: 'Профессор Жунус Абаевич внимательно смотрит на вас поверх очков.',
            student_choices: [
              {
                text: 'Я подготовила всё в точности по вашим указаниям, профессор. Проверьте лично.',
                type: 'diligent',
                label: 'Прилежный',
                next_node: 'end_pass',
                score_change: 15,
                penalties_change: 0,
                haptic: 'success',
              },
              {
                text: 'Надеюсь, мой практический материал произвел на вас должное впечатление...',
                type: 'flirty',
                label: 'Дерзкий',
                next_node: 'end_flirt',
                score_change: 20,
                penalties_change: 1,
                haptic: 'warning',
              },
            ],
          },
          end_pass: {
            is_end: true,
            grade: 'Отлично (Высший балл)',
            professor_mood: 'Снисходительный ценитель',
            professor_speech: 'Материал безупречен. Вы в очередной раз подтвердили статус лучшей дипломницы.',
            verdict: 'Безукоризненная подготовка, чуткое внимание к требованиям профессора.',
            score_bonus: 10,
            next_module_id: null,
          },
          end_flirt: {
            is_end: true,
            grade: 'Зачтено с особым предписанием',
            professor_mood: 'Опасное сокращение дистанции',
            professor_speech: 'Ваша смелость заслуживает высшей оценки, но требует строгого индивидуального надзора.',
            verdict: 'Выдающийся результат с повышенным личным вниманием научрука.',
            score_bonus: 15,
            next_module_id: null,
          },
        },
      },
    };

    setModulesList((prev) => [...prev, newModule]);

    setStudentData((prev) => ({
      ...prev,
      modulesState: {
        ...prev.modulesState,
        [newId]: {
          status: 'ready_to_report',
          grade: null,
          verdict: null,
          scoreEarned: 0,
          completedAt: null,
        },
      },
    }));

    triggerHaptic('success', hapticEnabled);
    sound.playStamp();
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
    setStudentData(getInitialStudentData(modulesList));
    setCurrentModuleId('module_2');
    setActiveTab('journal');
  };

  // Academic status calculation
  const score = studentData.score;
  let academicStatus = {
    title: 'Любимая дипломница с отличием',
    level: 'royal',
    color: 'text-[#d4af37]',
    badge: 'Абсолютный триумф',
    description: 'Безоговорочный авторитет, личный ключ от кафедры и безграничное внимание научрука.',
  };

  if (score < 30) {
    academicStatus = {
      title: 'Отчислена на ковер к профессору',
      level: 'danger',
      color: 'text-red-400',
      badge: 'На грани отчисления',
      description: 'Срочно требуется приватная аудиенция в кабинете научного руководителя.',
    };
  } else if (score < 60) {
    academicStatus = {
      title: 'Условно допущена к закрытой аттестации',
      level: 'medium',
      color: 'text-emerald-400',
      badge: 'Аттестована',
      description: 'Вы на верном пути, но профессор пристально следит за каждым вашим шагом.',
    };
  } else if (score < 90) {
    academicStatus = {
      title: 'Прилежная аспирантка с особыми привилегиями',
      level: 'high',
      color: 'text-amber-300',
      badge: 'Высшая лига',
      description: 'Профессор доверяет вам ключевые закрытые материалы и заседания.',
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
    // Modules list
    modulesList,
    addNewModule,
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
        : users.find((u) => u.role === 'student')?.name || 'Иза Любознательная',
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
    scenarioData: { modules: modulesList },
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
