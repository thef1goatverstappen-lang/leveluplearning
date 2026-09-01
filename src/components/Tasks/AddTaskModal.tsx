import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, Subject, Task } from '../../types';
import { getTodayDateString, PRIORITY_CONFIG } from '../../services/storage';
import { X, Sparkles, Calendar, BookOpen, AlertCircle, FileText } from 'lucide-react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

const ALL_SUBJECTS: Subject[] = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'History',
  'Computer Science',
  'Languages',
  'Visual Arts',
  'Physical Education',
  'Other',
];

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { addTask, editTask, userProfile } = useApp();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<Subject>('Mathematics');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(getTodayDateString());
  const [priority, setPriority] = useState<Priority>('Medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSubject(taskToEdit.subject);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
    } else {
      setTitle('');
      setSubject(userProfile.subjects[0] || 'Mathematics');
      setDescription('');
      setDueDate(getTodayDateString());
      setPriority('Medium');
    }
    setError('');
  }, [taskToEdit, isOpen, userProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    if (taskToEdit) {
      editTask({
        ...taskToEdit,
        title: title.trim(),
        subject,
        description: description.trim(),
        dueDate,
        priority,
      });
    } else {
      addTask({
        title: title.trim(),
        subject,
        description: description.trim(),
        dueDate,
        priority,
      });
    }

    onClose();
  };

  const getPriorityXP = (p: Priority) => {
    return PRIORITY_CONFIG[p].xp;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-purple-100 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <h3 className="font-heading font-black text-xl sm:text-2xl text-[#1F2937]">
              {taskToEdit ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Add homework, assignments, or study targets to earn XP
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Task Title <span className="text-[#8B5CF6]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 4 Quadratics Practice Problems"
              className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors"
            />
          </div>

          {/* Subject & Due Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Subject
              </label>
              <div className="relative">
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as Subject)}
                  className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors appearance-none cursor-pointer"
                >
                  {ALL_SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Due Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Priority Options with XP indicators */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Priority & XP Value
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(['Low', 'Medium', 'High'] as Priority[]).map((p) => {
                const config = PRIORITY_CONFIG[p];
                const isSelected = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-3 px-3.5 rounded-2xl border-2 text-left transition-all relative ${
                      isSelected
                        ? 'border-[#8B5CF6] bg-purple-50/80 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
                      <span className="font-black text-xs text-[#1F2937]">{p}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-black text-[#6D28D9]">
                      <Sparkles className="w-3 h-3" />
                      +{getPriorityXP(p)} XP
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Description & Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add assignment rubric details, page numbers, links or study goals..."
              className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-[#8B5CF6] hover:bg-[#6D28D9] text-white text-sm font-bold shadow-md shadow-purple-200 transition-all hover:scale-[1.01] flex items-center gap-2 min-h-[44px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task (+XP)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
