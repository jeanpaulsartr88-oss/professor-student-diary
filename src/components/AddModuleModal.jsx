import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, BookOpen, Sparkles, MapPin, Feather } from 'lucide-react';

export const AddModuleModal = ({ isOpen, onClose }) => {
  const { addNewModule, modulesList } = useApp();

  const nextOrder = (modulesList?.length || 5) + 1;

  const [title, setTitle] = useState(`Модуль ${nextOrder}: `);
  const [subtitle, setSubtitle] = useState('');
  const [room, setRoom] = useState('Кабинет № 305 • Приватный опрос');
  const [description, setDescription] = useState('');
  const [criteria, setCriteria] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addNewModule({
      title: title.trim(),
      subtitle: subtitle.trim() || 'Индивидуальная практическая сдача',
      room: room.trim() || 'Кабинет № 305',
      description: description.trim() || 'Практическое занятие с личной демонстрацией результатов перед научным руководителем.',
      notes: criteria.trim() || 'Критерии оценивания: наглядность представленного материала, послушание и точное выполнение указаний профессора.',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#1c1b22] border-2 border-[#d4af37]/60 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#722f37] to-[#4a1820] p-4 text-[#fffffe] flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-black/40 border border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
              <Feather className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-display tracking-widest text-[#f3e29f]">
                КАФЕДРА ПРИКЛАДНОГО ПОВИНОВЕНИЯ
              </span>
              <h3 className="text-sm font-bold font-serif-vintage leading-tight">
                Назначить новое занятие (№{nextOrder})
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/40 text-[#a7a9be] hover:text-[#fffffe] flex items-center justify-center active:scale-95 transition-transform"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-3.5 text-xs text-[#e4e4e7]">
          <div>
            <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
              Название модуля / занятия:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Модуль ${nextOrder}: Практическая проверка`}
              className="w-full px-3 py-2.5 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] focus:outline-none focus:border-[#d4af37]"
              required
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
              Краткий подзаголовок:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Сдача индивидуального видео/фото отчета тет-а-тет"
              className="w-full px-3 py-2 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
              Место проведения / Аудитория:
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 text-[#d4af37] absolute left-3 top-2.5" />
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="Кабинет № 305 • За закрытыми дверями"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
              Описание задания дипломнице:
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Опишите, какой именно материал дипломница Иза обязана предоставить профессору на проверку..."
              className="w-full p-2.5 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#a7a9be] tracking-wider block mb-1">
              Критерии оценивания профессора:
            </label>
            <textarea
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
              rows={2}
              placeholder="Критерии: степень послушания, раскованность, точность ракурсов и поз, отсутствие смущения..."
              className="w-full p-2.5 rounded-xl bg-[#16161a] border border-[#3a3546] text-xs text-[#fffffe] focus:outline-none focus:border-[#d4af37] resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#722f37] to-[#4a1820] hover:from-[#8e3b45] hover:to-[#5c1e28] text-[#fffffe] text-xs font-bold tracking-wider border border-[#d4af37]/70 shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-4 h-4 text-[#f3e29f]" />
            <span>Внести новое занятие в учебный план</span>
          </button>
        </form>
      </div>
    </div>
  );
};
