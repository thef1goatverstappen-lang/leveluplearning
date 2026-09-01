import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Task } from '../../types';
import { PRIORITY_CONFIG, SUBJECT_COLORS, getTodayDateString } from '../../services/storage';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  Zap,
  X,
} from 'lucide-react';

interface CalendarViewProps {
  onOpenAddTask: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenAddTask }) => {
  const { tasks, toggleCompleteTask, setCurrentTab, setActiveFocusTaskId } = useApp();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Month navigation
  const goToPrevious = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const goToNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewMode === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Helper to format date YYYY-MM-DD
  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayYMD = getTodayDateString();

  // Month calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate 42 calendar grid cells (6 rows x 7 days)
  const monthCells: { date: Date; isCurrentMonth: boolean; ymd: string }[] = [];

  // Prev month filler
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, daysInPrevMonth - i);
    monthCells.push({ date: d, isCurrentMonth: false, ymd: formatYMD(d) });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    monthCells.push({ date: d, isCurrentMonth: true, ymd: formatYMD(d) });
  }
  // Next month filler
  const remaining = 42 - monthCells.length;
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    monthCells.push({ date: d, isCurrentMonth: false, ymd: formatYMD(d) });
  }

  // Week calculation (7 days of currently focused week)
  const getWeekDays = () => {
    const currentDay = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDay);
    const week: { date: Date; ymd: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      week.push({ date: d, ymd: formatYMD(d) });
    }
    return week;
  };

  const weekDays = getWeekDays();

  // Format month and year label
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Calendar Header Control Bar */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#8B5CF6]">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F2937]">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {tasks.filter((t) => !t.completed).length} active assignments due this semester
            </p>
          </div>
        </div>

        {/* Navigation & View Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Previous / Next / Today */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] p-1.5 rounded-2xl">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-xl text-gray-600 hover:bg-white hover:text-gray-900 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-3.5 py-1.5 text-xs font-bold rounded-xl text-gray-700 hover:bg-white transition-all min-h-[36px]"
            >
              Today
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-xl text-gray-600 hover:bg-white hover:text-gray-900 transition-all min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Month / Week / Day Switcher */}
          <div className="flex bg-[#F3F4F6] p-1.5 rounded-2xl">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAddTask}
            className="px-4 py-2.5 bg-[#8B5CF6] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-200 flex items-center gap-1.5 min-h-[40px]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-gray-100 bg-[#F3F4F6]/50 text-center py-3">
            {daysOfWeek.map((day) => (
              <span key={day} className="text-xs font-black text-gray-400 uppercase tracking-wider">
                {day}
              </span>
            ))}
          </div>

          {/* 6-row Month Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-gray-100 min-h-[580px]">
            {monthCells.map((cell, idx) => {
              const cellTasks = tasks.filter((t) => t.dueDate === cell.ymd);
              const isToday = cell.ymd === todayYMD;

              return (
                <div
                  key={idx}
                  className={`p-2.5 flex flex-col justify-between transition-colors min-h-[105px] ${
                    cell.isCurrentMonth ? 'bg-white hover:bg-purple-50/20' : 'bg-gray-50/30 text-gray-400'
                  } ${isToday ? 'bg-purple-50/40' : ''}`}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? 'bg-[#8B5CF6] text-white shadow-xs'
                          : cell.isCurrentMonth
                          ? 'text-gray-800'
                          : 'text-gray-300'
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>

                    {cellTasks.length > 0 && (
                      <span className="text-[10px] font-black text-[#8B5CF6] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                        {cellTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Tasks on this Day */}
                  <div className="space-y-1.5 overflow-y-auto max-h-[85px]">
                    {cellTasks.slice(0, 3).map((task) => {
                      const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Other;
                      const priorityConfig = PRIORITY_CONFIG[task.priority];

                      return (
                        <div
                          key={task.id}
                          onClick={() => setSelectedTask(task)}
                          className={`px-2 py-1 rounded-lg text-[11px] font-bold truncate cursor-pointer transition-all hover:scale-[1.02] flex items-center gap-1.5 shadow-2xs ${
                            task.completed
                              ? 'bg-[#F3F4F6] text-gray-400 line-through border border-gray-200'
                              : `${subjectColor.bg} ${subjectColor.text} border ${subjectColor.border}`
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${priorityConfig.dot}`} />
                          <span className="truncate">{task.title}</span>
                        </div>
                      );
                    })}

                    {cellTasks.length > 3 && (
                      <span className="block text-[10px] font-black text-gray-400 text-center">
                        +{cellTasks.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDays.map((day) => {
              const dayTasks = tasks.filter((t) => t.dueDate === day.ymd);
              const isToday = day.ymd === todayYMD;

              return (
                <div
                  key={day.ymd}
                  className={`rounded-3xl p-4 border flex flex-col justify-between min-h-[350px] ${
                    isToday
                      ? 'border-purple-200 bg-purple-50/30 shadow-sm'
                      : 'border-gray-100 bg-[#F3F4F6]/50'
                  }`}
                >
                  {/* Day Header */}
                  <div className="border-b border-gray-200/60 pb-3 mb-3 text-center">
                    <span className="text-xs font-black uppercase text-gray-400 block">
                      {daysOfWeek[day.date.getDay()]}
                    </span>
                    <span
                      className={`inline-flex items-center justify-center font-heading font-black text-xl w-9 h-9 rounded-full mt-1 ${
                        isToday ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-200' : 'text-[#1F2937]'
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>

                  {/* Tasks List for Week Day */}
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    {dayTasks.length === 0 ? (
                      <p className="text-[11px] text-gray-400 font-medium text-center py-6">No tasks due</p>
                    ) : (
                      dayTasks.map((task) => {
                        const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Other;
                        return (
                          <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`p-2.5 rounded-2xl border text-xs font-bold cursor-pointer transition-all hover:shadow-xs ${
                              task.completed
                                ? 'bg-gray-100 text-gray-400 line-through border-gray-200'
                                : `${subjectColor.bg} ${subjectColor.text} border-purple-200/60`
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[9px] font-black uppercase tracking-wider">{task.subject}</span>
                              <span className="text-[9px] font-black">+{task.xpValue} XP</span>
                            </div>
                            <h5 className="font-bold text-[#1F2937] truncate">{task.title}</h5>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={onOpenAddTask}
                    className="mt-3 w-full py-2 rounded-xl border border-dashed border-gray-300 text-gray-500 hover:border-purple-400 hover:text-[#8B5CF6] text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {viewMode === 'day' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 max-w-2xl mx-auto space-y-6">
          <div className="text-center border-b border-gray-100 pb-5">
            <span className="text-xs font-black text-[#8B5CF6] uppercase tracking-wider">
              {daysOfWeek[currentDate.getDay()]} Schedule
            </span>
            <h3 className="font-heading font-black text-3xl text-[#1F2937] mt-1">
              {monthNames[month]} {currentDate.getDate()}, {year}
            </h3>
          </div>

          <div className="space-y-3">
            {tasks.filter((t) => t.dueDate === formatYMD(currentDate)).length === 0 ? (
              <div className="text-center py-10">
                <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="font-heading font-bold text-[#1F2937] text-lg">
                  No assignments scheduled for this day
                </p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                  Enjoy your free time or add a self-paced study block!
                </p>
                <button
                  onClick={onOpenAddTask}
                  className="mt-4 px-5 py-2.5 bg-[#8B5CF6] text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200"
                >
                  + Add Assignment for This Date
                </button>
              </div>
            ) : (
              tasks
                .filter((t) => t.dueDate === formatYMD(currentDate))
                .map((task) => {
                  const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Other;
                  const priorityConfig = PRIORITY_CONFIG[task.priority];

                  return (
                    <div
                      key={task.id}
                      className="p-5 rounded-3xl border border-gray-100 hover:border-purple-200 hover:shadow-sm transition-all flex items-center justify-between gap-3 bg-white"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          onClick={() => toggleCompleteTask(task.id)}
                          className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-colors ${
                            task.completed
                              ? 'bg-[#10B981] border-[#10B981] text-white'
                              : 'border-gray-300 text-transparent hover:border-[#8B5CF6]'
                          }`}
                        >
                          {task.completed ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${subjectColor.bg} ${subjectColor.text}`}>
                              {task.subject}
                            </span>
                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${priorityConfig.bg}`}>
                              {task.priority} Priority
                            </span>
                          </div>
                          <h4 className={`font-heading font-bold text-base ${task.completed ? 'line-through text-gray-400' : 'text-[#1F2937]'}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-gray-500 mt-0.5 font-medium">{task.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-bold text-[#6D28D9] bg-purple-50 px-2.5 py-1 rounded-xl">
                          +{task.xpValue} XP
                        </span>
                        <button
                          onClick={() => {
                            setActiveFocusTaskId(task.id);
                            setCurrentTab('focus');
                          }}
                          className="p-2.5 bg-purple-50 hover:bg-purple-100 text-[#8B5CF6] rounded-2xl"
                          title="Focus timer"
                        >
                          <Zap className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* TASK DETAILS POPUP MODAL (When clicking a calendar event) */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-purple-100 relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    (SUBJECT_COLORS[selectedTask.subject] || SUBJECT_COLORS.Other).bg
                  } ${(SUBJECT_COLORS[selectedTask.subject] || SUBJECT_COLORS.Other).text}`}
                >
                  {selectedTask.subject}
                </span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md ${
                    PRIORITY_CONFIG[selectedTask.priority].bg
                  }`}
                >
                  {selectedTask.priority} Priority
                </span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="p-2 rounded-2xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              <h3 className="font-heading font-bold text-lg text-[#1F2937]">
                {selectedTask.title}
              </h3>
              {selectedTask.description ? (
                <p className="text-xs text-gray-600 leading-relaxed bg-[#F3F4F6] p-3.5 rounded-2xl font-medium">
                  {selectedTask.description}
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic">No additional notes provided.</p>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs bg-purple-50/60 p-3.5 rounded-2xl border border-purple-100">
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">Due Date:</span>
                  <span className="font-bold text-[#1F2937]">
                    {new Date(selectedTask.dueDate + 'T00:00:00').toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase tracking-wider block text-[10px]">XP Reward:</span>
                  <span className="font-black text-[#6D28D9]">+{selectedTask.xpValue} XP</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  toggleCompleteTask(selectedTask.id);
                  setSelectedTask(null);
                }}
                className={`flex-1 py-3 rounded-2xl font-bold text-xs text-white transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                  selectedTask.completed ? 'bg-gray-600 hover:bg-gray-700' : 'bg-[#10B981] hover:bg-emerald-700 shadow-md shadow-emerald-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{selectedTask.completed ? 'Mark Active' : 'Complete & Earn XP'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveFocusTaskId(selectedTask.id);
                  setSelectedTask(null);
                  setCurrentTab('focus');
                }}
                className="px-5 py-3 bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-purple-200 min-h-[44px]"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Start Focus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
