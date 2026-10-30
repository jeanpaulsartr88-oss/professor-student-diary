import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Eye,
  Feather,
  Plus,
  AlertTriangle,
} from 'lucide-react';

export const ProfessorCabinetScreen = () => {
  const {
    currentModuleId,
    scenarioData,
    completeModule,
    setActiveTab,
    hapticEnabled,
    studentName,
    professorChangePenalties,
    professorChangeScore,
  } = useApp();

  const currentModule =
    scenarioData.modules.find((m) => m.id === currentModuleId) ||
    scenarioData.modules[0];

  const dialogTree = currentModule.dialog_tree;
  const [currentNodeId, setCurrentNodeId] = useState(dialogTree.start_node);
  const [customMood, setCustomMood] = useState(null);
  const [history, setHistory] = useState([]);
  const [examFinished, setExamFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setCurrentNodeId(dialogTree.start_node);
    setHistory([]);
    setExamFinished(false);
    setFinalResult(null);
    setCustomMood(null);
  }, [currentModuleId, dialogTree.start_node]);

  const currentNode = dialogTree.nodes[currentNodeId] || {};

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentNodeId]);

  const activeMoodName = customMood || currentNode.professor_mood || 'Строгий цензор';

  const moods = [
    { name: 'Строгий цензор', icon: ShieldAlert, color: 'border-blue-500/50 text-blue-300' },
    { name: 'Снисходительный ценитель', icon: Award, color: 'border-[#d4af37] text-[#f3e29f]' },
    { name: 'Опасное сокращение дистанции', icon: Flame, color: 'border-red-600 text-red-300' },
    { name: 'Взыскательный ментор', icon: Eye, color: 'border-purple-500/50 text-purple-300' },
  ];

  const handleSelectStudentReaction = (choice) => {
    triggerHaptic(choice.haptic || 'success', hapticEnabled);
    sound.playClick();

    setHistory((prev) => [
      ...prev,
      {
        speaker: 'professor',
        speech: currentNode.professor_speech,
        mood: activeMoodName,
      },
      {
        speaker: 'student',
        text: choice.text,
        type: choice.type,
        label: choice.label,
        scoreDelta: choice.score_change,
        penaltiesDelta: choice.penalties_change,
      },
    ]);

    const targetNodeId = choice.next_node;
    const targetNode = dialogTree.nodes[targetNodeId];

    if (targetNode && targetNode.is_end) {
      setCurrentNodeId(targetNodeId);
      setExamFinished(true);
      setFinalResult(targetNode);

      completeModule({
        moduleId: currentModule.id,
        grade: targetNode.grade,
        verdict: targetNode.verdict,
        scoreBonus: (choice.score_change || 0) + (targetNode.score_bonus || 0),
        penaltiesAwarded: (choice.penalties_change || 0) + (targetNode.penalties_awarded || 0),
        nextModuleId: targetNode.next_module_id,
      });

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#722f37', '#ffffff'],
        });
      } catch (e) {
        // ignore
      }
    } else if (targetNode) {
      setCurrentNodeId(targetNodeId);
    }
  };

  const handleRestart = () => {
    triggerHaptic('light', hapticEnabled);
    sound.playClick();
    setCurrentNodeId(dialogTree.start_node);
    setHistory([]);
    setExamFinished(false);
    setFinalResult(null);
  };

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-3.5 py-3 space-y-3 max-w-lg mx-auto w-full relative">
      {/* Top Banner: Professor Desk */}
      <div className="bg-[#1c1b22] border border-[#722f37] rounded-2xl p-3.5 shadow-md space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
              КАБИНЕТ ЭКЗАМЕНАТОРА
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#16161a] text-[#8f90a6] border border-[#2e2b38]">
              {currentModule.room}
            </span>
          </div>

          <button
            onClick={handleRestart}
            className="text-[10px] text-[#a7a9be] hover:text-[#fffffe] flex items-center space-x-1 active:scale-95 transition-all"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Начать опрос сначала</span>
          </button>
        </div>

        {/* Dynamic Mood Selection */}
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-[#a7a9be] font-semibold tracking-wider block">
            Ваш академический тон и настрой:
          </span>
          <div className="grid grid-cols-2 gap-1.5">
            {moods.map((m) => {
              const Icon = m.icon;
              const isSelected = activeMoodName === m.name;

              return (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => {
                    setCustomMood(m.name);
                    triggerHaptic('selection', hapticEnabled);
                  }}
                  className={`p-1.5 rounded-xl border text-left text-[10px] font-semibold flex items-center space-x-1.5 transition-all active:scale-95 ${
                    isSelected
                      ? `bg-[#722f37]/40 ${m.color} shadow-sm font-bold`
                      : 'bg-[#16161a] border-[#2e2b38] text-[#8f90a6]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dialogue Conversation Stream */}
      <div className="flex-1 space-y-3 min-h-[140px]">
        {history.map((msg, idx) => {
          if (msg.speaker === 'professor') {
            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center space-x-2 text-[10px] text-[#d4af37] px-1">
                  <span>Вы (Профессор Жунус Абаевич):</span>
                </div>
                <div className="bg-[#1c1b22] border-l-4 border-[#d4af37] p-3 rounded-r-xl text-xs font-serif-vintage text-[#fffffe] shadow-sm leading-relaxed">
                  «{msg.speech}»
                </div>
              </div>
            );
          } else {
            return (
              <div key={idx} className="flex justify-end">
                <div className="max-w-[85%] bg-gradient-to-r from-[#24222e] to-[#2c2738] border border-[#722f37]/50 p-2.5 rounded-2xl rounded-tr-none text-xs text-[#f3e29f] font-serif-vintage shadow-md space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[9px] text-[#a7a9be]">
                    <span className="font-semibold uppercase tracking-wider text-[#d4af37]">
                      {studentName} ({msg.label})
                    </span>
                    {msg.scoreDelta && <span>+{msg.scoreDelta} б.</span>}
                  </div>
                  <p className="leading-snug italic text-[#fffffe]">«{msg.text}»</p>
                </div>
              </div>
            );
          }
        })}

        {/* Current Professor Speech Prompt */}
        {!examFinished && currentNode.professor_speech && (
          <div className="space-y-2 animate-fade-in">
            <div className="bg-gradient-to-br from-[#1c1b22] via-[#221f2c] to-[#1c1b22] border-l-4 border-[#722f37] p-4 rounded-2xl rounded-tl-none shadow-xl relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-[#d4af37] font-display">
                  Ваш вопрос дипломнице {studentName}:
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-[#a7a9be] border border-[#2e2b38]">
                  {activeMoodName}
                </span>
              </div>

              <p className="text-base sm:text-lg text-[#fffffe] font-serif-vintage leading-relaxed italic">
                «{currentNode.professor_speech}»
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Professor Choice / Hearing Student Replies */}
      <div className="sticky bottom-0 bg-[#16161a]/95 backdrop-blur-md pt-2 pb-1 shrink-0 z-10 border-t border-[#2e2b38]">
        {!examFinished && currentNode.student_choices && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-[10px] text-[#a7a9be]">
              <span className="uppercase font-display tracking-widest text-[#d4af37]">
                Реакция студентки на ваш вопрос:
              </span>
              <span className="italic font-serif-vintage">Выберите ответ для разбора</span>
            </div>

            <div className="space-y-2">
              {currentNode.student_choices.map((choice, idx) => {
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectStudentReaction(choice)}
                    className="w-full text-left p-3 rounded-xl border text-xs bg-[#1c1b22] hover:bg-[#251e2a] border-[#3a3546] hover:border-[#d4af37] transition-all duration-200 active:scale-[0.98] shadow-md group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-[#722f37]/40 text-[#f3e29f]">
                        {choice.label || 'Ответ'}
                      </span>
                      <span className="text-[10px] font-semibold text-[#d4af37]">
                        +{choice.score_change} б.
                        {choice.penalties_change ? ' • +1 отработка' : ''}
                      </span>
                    </div>

                    <p className="text-sm text-[#fffffe] font-serif-vintage leading-snug italic">
                      «{choice.text}»
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Exam Finished Final Assessment */}
        {examFinished && finalResult && (
          <div className="bg-[#1c1b22] border-2 border-[#d4af37] rounded-2xl p-4 shadow-2xl space-y-3.5 animate-fade-in">
            <div className="flex items-start justify-between border-b border-[#2e2b38] pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
                  РЕЗОЛЮЦИЯ НАУЧНОГО РУКОВОДИТЕЛЯ
                </span>
                <h3 className="text-base font-bold font-serif-vintage text-[#fffffe] leading-tight mt-0.5">
                  {finalResult.grade}
                </h3>
              </div>

              <div className="stamp-effect border-2 border-[#d4af37] text-[#d4af37] text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest rotate-[-8deg] shadow-lg">
                ПОДПИСАНО
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#16161a] border border-[#2e2b38] space-y-1">
              <span className="text-[10px] uppercase text-[#a7a9be] font-semibold tracking-wider">
                Ваша резолюция в ведомость:
              </span>
              <p className="text-xs text-[#fffffe] italic font-serif-vintage leading-relaxed">
                «{finalResult.verdict}»
              </p>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setActiveTab('gradebook')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] text-[#fffffe] text-xs font-semibold border border-[#d4af37]/40 shadow-lg active:scale-95 transition-all text-center"
              >
                📜 В реестр зачетки
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className="py-2.5 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#c5c6d0] text-xs border border-[#3a3546] active:scale-95 transition-all"
              >
                К ведомости
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
