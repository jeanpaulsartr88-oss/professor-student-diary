import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { triggerHaptic } from '../utils/telegram';
import { sound } from '../utils/sound';
import confetti from 'canvas-confetti';
import { StudyNotesModal } from './StudyNotesModal';
import {
  ShieldAlert,
  Flame,
  Award,
  Sparkles,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Eye,
  Heart,
  Scroll,
} from 'lucide-react';

export const CabinetScreen = () => {
  const {
    currentModuleId,
    scenarioData,
    completeModule,
    setActiveTab,
    hapticEnabled,
    score,
    penalties,
    studentName,
  } = useApp();

  // Find active module data
  const currentModule =
    scenarioData.modules.find((m) => m.id === currentModuleId) ||
    scenarioData.modules[0];

  const dialogTree = currentModule.dialog_tree;
  const [currentNodeId, setCurrentNodeId] = useState(dialogTree.start_node);
  const [history, setHistory] = useState([]);
  const [examFinished, setExamFinished] = useState(false);
  const [finalResult, setFinalResult] = useState(null);
  const [scoreNotification, setScoreNotification] = useState(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const messagesEndRef = useRef(null);

  // When module changes, reset dialogue to start
  useEffect(() => {
    setCurrentNodeId(dialogTree.start_node);
    setHistory([]);
    setExamFinished(false);
    setFinalResult(null);
  }, [currentModuleId, dialogTree.start_node]);

  // Current node in scenario
  const currentNode = dialogTree.nodes[currentNodeId] || {};

  // Auto scroll dialogue container
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, currentNodeId]);

  // Trigger confetti when exam ends successfully
  useEffect(() => {
    if (examFinished && finalResult) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#722f37', '#f3e29f', '#ffffff'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [examFinished, finalResult]);

  // Choice selection handler
  const handleChoice = (choice) => {
    triggerHaptic(choice.haptic || 'success', hapticEnabled);
    sound.playClick();

    // Show floating score notification
    if (choice.score_change || choice.penalties_change) {
      setScoreNotification({
        scoreChange: choice.score_change || 0,
        penaltiesChange: choice.penalties_change || 0,
      });
      setTimeout(() => setScoreNotification(null), 2500);
    }

    // Add current professor speech & student reply to transcript history
    setHistory((prev) => [
      ...prev,
      {
        speaker: 'professor',
        speech: currentNode.professor_speech,
        mood: currentNode.professor_mood,
        actionHint: currentNode.action_hint,
      },
      {
        speaker: 'student',
        text: choice.text,
        type: choice.type,
        label: choice.label,
        scoreDelta: choice.score_change,
      },
    ]);

    const targetNodeId = choice.next_node;
    const targetNode = dialogTree.nodes[targetNodeId];

    if (targetNode && targetNode.is_end) {
      // Reached ending node
      setCurrentNodeId(targetNodeId);
      setExamFinished(true);
      setFinalResult(targetNode);

      // Save module completion
      completeModule({
        moduleId: currentModule.id,
        grade: targetNode.grade,
        verdict: targetNode.verdict,
        scoreBonus: (choice.score_change || 0) + (targetNode.score_bonus || 0),
        penaltiesAwarded: (choice.penalties_change || 0) + (targetNode.penalties_awarded || 0),
        nextModuleId: targetNode.next_module_id,
      });
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

  // Get mood display properties
  const getMoodConfig = (mood) => {
    switch (mood) {
      case 'Строгий цензор':
        return {
          title: 'Строгий цензор',
          color: 'text-blue-300 border-blue-500/40 bg-blue-950/30',
          dot: 'bg-blue-400',
          icon: ShieldAlert,
          description: 'Холодная требовательность и безупречная субординация.',
        };
      case 'Снисходительный ценитель':
        return {
          title: 'Снисходительный ценитель',
          color: 'text-[#f3e29f] border-[#d4af37]/40 bg-amber-950/30',
          dot: 'bg-[#d4af37]',
          icon: Award,
          description: 'Взгляд эстета, готового поощрить за усердие и красоту мысли.',
        };
      case 'Опасное сокращение дистанции':
        return {
          title: 'Опасное сокращение дистанции',
          color: 'text-red-300 border-[#722f37] bg-[#722f37]/30',
          dot: 'bg-red-500 animate-ping',
          icon: Flame,
          description: 'Личные границы стираются. В воздухе искрит напряжение.',
        };
      case 'Взыскательный ментор':
        return {
          title: 'Взыскательный ментор',
          color: 'text-purple-300 border-purple-500/40 bg-purple-950/30',
          dot: 'bg-purple-400',
          icon: Eye,
          description: 'Дисциплинарный надзор и проверка характера на прочность.',
        };
      default:
        return {
          title: mood || 'Академический надзор',
          color: 'text-[#d4af37] border-[#d4af37]/40 bg-black/40',
          dot: 'bg-[#d4af37]',
          icon: Sparkles,
          description: 'Официальный экзамен за закрытыми дверями кафедры.',
        };
    }
  };

  const activeMood = getMoodConfig(currentNode.professor_mood);
  const MoodIcon = activeMood.icon;

  return (
    <div className="flex-1 overflow-y-auto flex flex-col px-3.5 py-3 space-y-3 max-w-lg mx-auto w-full relative">
      {/* Floating score delta notification */}
      {scoreNotification && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 bg-[#1c1b22]/95 border border-[#d4af37] px-4 py-1.5 rounded-full shadow-2xl flex items-center space-x-2 animate-bounce">
          {scoreNotification.scoreChange > 0 && (
            <span className="text-xs font-bold text-[#f3e29f] flex items-center space-x-1">
              <span>+{scoreNotification.scoreChange} баллов</span>
            </span>
          )}
          {scoreNotification.penaltiesChange > 0 && (
            <span className="text-xs font-bold text-red-400 flex items-center space-x-1">
              <span>+{scoreNotification.penaltiesChange} отработка</span>
            </span>
          )}
        </div>
      )}

      {/* Professor Mood Card & Room Banner */}
      <div className="bg-[#1c1b22] border border-[#2e2b38] rounded-2xl p-3.5 shadow-md space-y-2 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
              КАБИНЕТ НАУЧРУКА
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#16161a] text-[#8f90a6] border border-[#2e2b38]">
              {currentModule.room || 'Аудитория 305'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsNotesOpen(true)}
              className="text-[10px] text-[#f3e29f] hover:text-[#fffffe] flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#16161a] border border-[#d4af37]/40 active:scale-95 transition-all shadow-sm"
              title="Открыть методический конспект к модулю"
            >
              <BookOpen className="w-3 h-3 text-[#d4af37]" />
              <span>Конспект</span>
            </button>

            <button
              onClick={handleRestart}
              className="text-[10px] text-[#a7a9be] hover:text-[#fffffe] flex items-center space-x-1 px-2 py-1 rounded-lg bg-[#16161a] border border-[#2e2b38] active:scale-95 transition-all"
              title="Начать диалог сначала"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Сброс</span>
            </button>
          </div>
        </div>

        {/* Dynamic Mood Card */}
        <div
          className={`px-3 py-2 rounded-xl border flex items-center justify-between transition-all duration-300 ${activeMood.color}`}
        >
          <div className="flex items-center space-x-2.5">
            <div className="relative">
              <span className={`w-2.5 h-2.5 rounded-full block ${activeMood.dot}`} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold font-display">{activeMood.title}</span>
              </div>
              <p className="text-[10px] text-[#a7a9be] italic font-serif-vintage line-clamp-1">
                {activeMood.description}
              </p>
            </div>
          </div>
          <MoodIcon className="w-4 h-4 shrink-0 opacity-80" />
        </div>
      </div>

      {/* Dialogue Conversation Stream */}
      <div className="flex-1 space-y-3 min-h-[140px]">
        {/* Past messages history */}
        {history.map((msg, idx) => {
          if (msg.speaker === 'professor') {
            return (
              <div key={idx} className="space-y-1 opacity-80">
                {msg.actionHint && (
                  <p className="text-[10px] text-[#8f90a6] italic font-serif-vintage px-2">
                    *{msg.actionHint}*
                  </p>
                )}
                <div className="bg-[#1c1b22] border-l-2 border-[#722f37] p-3 rounded-r-xl text-xs font-serif-vintage text-[#c5c6d0] shadow-sm leading-relaxed">
                  «{msg.speech}»
                </div>
              </div>
            );
          } else {
            return (
              <div key={idx} className="flex justify-end">
                <div className="max-w-[85%] bg-gradient-to-r from-[#24222e] to-[#2c2738] border border-[#d4af37]/30 p-2.5 rounded-2xl rounded-tr-none text-xs text-[#fffffe] font-serif-vintage shadow-md space-y-1">
                  <div className="flex items-center justify-between gap-2 text-[9px] text-[#f3e29f]">
                    <span className="font-semibold uppercase tracking-wider">{msg.label || 'Ответ'}</span>
                    {msg.scoreDelta && <span>+{msg.scoreDelta} б.</span>}
                  </div>
                  <p className="leading-snug italic">«{msg.text}»</p>
                </div>
              </div>
            );
          }
        })}

        {/* Current Professor Active Speech */}
        {!examFinished && currentNode.professor_speech && (
          <div className="space-y-2 animate-fade-in">
            {/* Atmospheric cue */}
            {currentNode.action_hint && (
              <div className="flex items-center space-x-1.5 text-[11px] text-[#d4af37]/90 italic font-serif-vintage px-2 py-0.5">
                <Sparkles className="w-3 h-3 text-[#d4af37]" />
                <span>{currentNode.action_hint}</span>
              </div>
            )}

            {/* Speech bubble */}
            <div className="bg-gradient-to-br from-[#1c1b22] via-[#221f2c] to-[#1c1b22] border-l-4 border-[#d4af37] p-4 rounded-2xl rounded-tl-none shadow-xl relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#722f37] flex items-center justify-center text-[10px] font-bold text-[#f3e29f]">
                    ЖА
                  </div>
                  <span className="text-xs font-bold text-[#fffffe] font-display">
                    Профессор Жунус Абаевич
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-[#a7a9be] border border-[#2e2b38]">
                  {currentNode.professor_mood}
                </span>
              </div>

              <p className="text-base sm:text-lg text-[#fffffe] font-serif-vintage leading-relaxed tracking-wide italic">
                «{currentNode.professor_speech}»
              </p>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Area: Student Choice Buttons OR Exam Verdict Card */}
      <div className="sticky bottom-0 bg-[#16161a]/95 backdrop-blur-md pt-2 pb-1 shrink-0 z-10 border-t border-[#2e2b38]">
        {!examFinished && currentNode.student_choices && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1 text-[10px] text-[#a7a9be]">
              <span className="uppercase font-display tracking-widest text-[#d4af37]">
                Ваш ответ научруку:
              </span>
              <span className="italic font-serif-vintage">Выберите реплику</span>
            </div>

            <div className="space-y-2">
              {currentNode.student_choices.map((choice, idx) => {
                const isFlirty = choice.type === 'flirty';
                const isSubmissive = choice.type === 'submissive';

                return (
                  <button
                    key={idx}
                    onClick={() => handleChoice(choice)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all duration-200 active:scale-[0.98] relative overflow-hidden group shadow-md ${
                      isFlirty
                        ? 'bg-[#1c1b22] hover:bg-[#251e2a] border-[#722f37]/70 hover:border-[#943a45]'
                        : isSubmissive
                        ? 'bg-[#1c1b22] hover:bg-[#24222e] border-amber-800/40 hover:border-amber-500/60'
                        : 'bg-[#1c1b22] hover:bg-[#24222e] border-[#3a3546] hover:border-[#d4af37]/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded ${
                          isFlirty
                            ? 'bg-[#722f37]/40 text-[#f3e29f]'
                            : isSubmissive
                            ? 'bg-amber-950/40 text-amber-300'
                            : 'bg-blue-950/40 text-blue-300'
                        }`}
                      >
                        {choice.label || 'Ответ'}
                      </span>
                      <span className="text-[10px] font-semibold text-[#d4af37]">
                        +{choice.score_change} б.
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

        {/* Exam Finished Final Assessment Card */}
        {examFinished && finalResult && (
          <div className="bg-[#1c1b22] border-2 border-[#d4af37] rounded-2xl p-4 shadow-2xl space-y-3.5 relative overflow-hidden animate-fade-in">
            {/* Background seal water-mark */}
            <div className="absolute right-2 -bottom-4 text-[70px] text-[#d4af37]/10 font-display select-none pointer-events-none">
              VERITAS
            </div>

            {/* Official Header */}
            <div className="flex items-start justify-between border-b border-[#2e2b38] pb-2.5">
              <div>
                <span className="text-[10px] uppercase font-display tracking-widest text-[#d4af37]">
                  ИТОГОВАЯ ВЕДОМОСТЬ КАФЕДРЫ
                </span>
                <h3 className="text-base font-bold font-serif-vintage text-[#fffffe] leading-tight mt-0.5">
                  {finalResult.grade}
                </h3>
              </div>

              {/* Red ink stamp effect */}
              <div className="stamp-effect border-2 border-red-500 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest rotate-[-8deg] shadow-lg">
                СДАНО
              </div>
            </div>

            {/* Professor Written Verdict */}
            <div className="p-3 rounded-xl bg-[#16161a] border border-[#2e2b38] space-y-1">
              <span className="text-[10px] uppercase text-[#a7a9be] font-semibold tracking-wider">
                Резолюция научного руководителя:
              </span>
              <p className="text-xs text-[#fffffe] italic font-serif-vintage leading-relaxed">
                «{finalResult.verdict}»
              </p>
            </div>

            {/* Final Points Bonus */}
            <div className="flex items-center justify-between text-xs px-1 text-[#f3e29f]">
              <span className="text-[#a7a9be]">Начислено в зачетную книжку:</span>
              <span className="font-bold text-[#d4af37]">+{finalResult.score_bonus || 5} баллов</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setActiveTab('gradebook')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-semibold border border-[#d4af37]/40 shadow-lg active:scale-95 transition-all text-center"
              >
                📜 В зачетную книжку
              </button>
              <button
                onClick={() => setActiveTab('journal')}
                className="py-2.5 px-3 rounded-xl bg-[#24222e] hover:bg-[#2e2b38] text-[#c5c6d0] text-xs border border-[#3a3546] active:scale-95 transition-all"
              >
                К списку тем
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Study Notes Modal during exam */}
      {isNotesOpen && (
        <StudyNotesModal
          module={currentModule}
          onClose={() => setIsNotesOpen(false)}
        />
      )}
    </div>
  );
};
