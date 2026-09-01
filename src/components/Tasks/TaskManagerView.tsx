import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, Subject, Task } from '../../types';
import { PRIORITY_CONFIG, SUBJECT_COLORS, getTodayDateString } from '../../services/storage';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  Zap,
  Check,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  X,
  BookOpen,
  ArrowUpDown,
  Flame,
} from 'lucide-react';

interface TaskManagerViewProps {
  onOpenAddTask: () => void;
  onEditTask: (task: Task) => void;
}

export type UrgencyFilter = 'all' | 'overdue' | 'today' | 'thisWeek' | 'upcoming';

export const TaskManagerView: React.FC<TaskManagerViewProps> = ({ onOpenAddTask, onEditTask }) => {
  const { tasks, toggleCompleteTask, deleteTask, setCurrentTab, setActiveFocusTaskId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<UrgencyFilter>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [sortBy, setSortBy] = useState<'urgency' | 'dueDate' | 'priority' | 'xp' | 'title'>('urgency');

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Compute urgency helper for any task
  const getTaskUrgency = (dueDate: string, completed: boolean): 'overdue' | 'today' | 'thisWeek' | 'upcoming' => {
    if (completed) return 'upcoming';
    if (dueDate < todayStr) return 'overdue';
    if (dueDate === todayStr) return 'today';

    const dueTime = new Date(dueDate + 'T00:00:00').getTime();
    const nowTime = new Date(todayStr + 'T00:00:00').getTime();
    const diffDays = (dueTime - nowTime) / (1000 * 60 * 60 * 24);

    if (diffDays <= 7) return 'thisWeek';
    return 'upcoming';
  };

  // Count calculations for quick badges (memoized for performance)
  const taskCounts = useMemo(() => {
    let overdue = 0;
    let today = 0;
    let thisWeek = 0;
    let upcoming = 0;
    let high = 0;
    let medium = 0;
    let low = 0;
    let pending = 0;
    let completed = 0;

    const subjectCounts: Record<string, number> = {};

    tasks.forEach((t) => {
      if (t.completed) {
        completed++;
      } else {
        pending++;
        const urgency = getTaskUrgency(t.dueDate, t.completed);
        if (urgency === 'overdue') overdue++;
        else if (urgency === 'today') today++;
        else if (urgency === 'thisWeek') thisWeek++;
        else upcoming++;

        if (t.priority === 'High') high++;
        else if (t.priority === 'Medium') medium++;
        else if (t.priority === 'Low') low++;
      }

      subjectCounts[t.subject] = (subjectCounts[t.subject] || 0) + 1;
    });

    return {
      total: tasks.length,
      pending,
      completed,
      overdue,
      today,
      thisWeek,
      upcoming,
      high,
      medium,
      low,
      subjectCounts,
    };
  }, [tasks, todayStr]);

  // All distinct subject labels present in current dataset
  const allSubjectsList = useMemo(() => {
    const subjects = Array.from(new Set(tasks.map((t) => t.subject)));
    return subjects.sort();
  }, [tasks]);

  // Filter tasks with memoization for snappy performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = task.description?.toLowerCase().includes(q);
        const matchSubject = task.subject.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchSubject) return false;
      }

      // 2. Subject Filter
      if (selectedSubject !== 'All' && task.subject !== selectedSubject) {
        return false;
      }

      // 3. Priority Filter
      if (selectedPriority !== 'All' && task.priority !== selectedPriority) {
        return false;
      }

      // 4. Status Filter
      if (selectedStatus === 'pending' && task.completed) return false;
      if (selectedStatus === 'completed' && !task.completed) return false;

      // 5. Urgency Filter (applies primarily to incomplete tasks or filtered dates)
      if (selectedUrgency !== 'all') {
        const urgency = getTaskUrgency(task.dueDate, task.completed);
        if (selectedUrgency === 'overdue' && (task.completed || urgency !== 'overdue')) {
          return false;
        }
        if (selectedUrgency === 'today' && task.dueDate !== todayStr) {
          return false;
        }
        if (selectedUrgency === 'thisWeek') {
          const dueTime = new Date(task.dueDate + 'T00:00:00').getTime();
          const nowTime = new Date(todayStr + 'T00:00:00').getTime();
          const diffDays = (dueTime - nowTime) / (1000 * 60 * 60 * 24);
          if (diffDays < 0 || diffDays > 7) return false;
        }
        if (selectedUrgency === 'upcoming') {
          const dueTime = new Date(task.dueDate + 'T00:00:00').getTime();
          const nowTime = new Date(todayStr + 'T00:00:00').getTime();
          const diffDays = (dueTime - nowTime) / (1000 * 60 * 60 * 24);
          if (diffDays <= 7) return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, selectedSubject, selectedPriority, selectedStatus, selectedUrgency, todayStr]);

  // Sort tasks with memoization
  const sortedTasks = useMemo(() => {
    return [...filteredTasks].sort((a, b) => {
      if (sortBy === 'urgency') {
        // Overdue first, then upcoming by due date, then completed
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const timeA = new Date(a.dueDate + 'T00:00:00').getTime();
        const timeB = new Date(b.dueDate + 'T00:00:00').getTime();
        return timeA - timeB;
      }
      if (sortBy === 'dueDate') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'priority') {
        const priorityOrder: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === 'xp') {
        return b.xpValue - a.xpValue;
      }
      return a.title.localeCompare(b.title);
    });
  }, [filteredTasks, sortBy]);

  const pendingTasks = useMemo(() => sortedTasks.filter((t) => !t.completed), [sortedTasks]);
  const completedTasks = useMemo(() => sortedTasks.filter((t) => t.completed), [sortedTasks]);

  // Check if any filter is actively applied
  const isFiltered = useMemo(() => {
    return (
      searchQuery.trim() !== '' ||
      selectedSubject !== 'All' ||
      selectedPriority !== 'All' ||
      selectedUrgency !== 'all' ||
      selectedStatus !== 'all'
    );
  }, [searchQuery, selectedSubject, selectedPriority, selectedUrgency, selectedStatus]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedPriority('All');
    setSelectedUrgency('all');
    setSelectedStatus('all');
  };

  const formatDueDate = (dateString: string, completed: boolean) => {
    if (completed) {
      const dateObj = new Date(dateString + 'T00:00:00');
      return `Due ${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    if (dateString < todayStr) {
      const dateObj = new Date(dateString + 'T00:00:00');
      return `Past Due (${dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
    }
    if (dateString === todayStr) return 'Due Today';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    if (dateString === tomorrowStr) return 'Due Tomorrow';

    const dateObj = new Date(dateString + 'T00:00:00');
    return `Due ${dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. OVERDUE ALERT BANNER (If any overdue tasks exist and not currently filtering by overdue) */}
      {taskCounts.overdue > 0 && selectedUrgency !== 'overdue' && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EF4444] text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm sm:text-base text-rose-900">
                You have {taskCounts.overdue} overdue {taskCounts.overdue === 1 ? 'assignment' : 'assignments'}!
              </h4>
              <p className="text-xs text-rose-700 font-medium mt-0.5">
                Complete them now to recover XP points and preserve your streak.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelectedUrgency('overdue');
              setSelectedStatus('pending');
            }}
            className="px-4 py-2 bg-[#EF4444] hover:bg-rose-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-rose-200 shrink-0 transition-colors"
          >
            Filter Overdue ({taskCounts.overdue})
          </button>
        </div>
      )}

      {/* 2. TOP HEADER & SEARCH / FILTER CONTROL CENTER */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F2937]">
              Task Manager
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
              Filter by urgency, priority, or subject to prioritize high-value homework and earn XP
            </p>
          </div>

          <button
            onClick={onOpenAddTask}
            className="px-5 py-3 bg-[#8B5CF6] hover:bg-[#6D28D9] active:bg-purple-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-purple-200 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* 3. QUICK SUBJECT PILLS SELECTOR */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6]" />
              Filter by Subject
            </span>
            {selectedSubject !== 'All' && (
              <button
                onClick={() => setSelectedSubject('All')}
                className="text-[11px] font-bold text-[#8B5CF6] hover:underline"
              >
                Clear subject
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none no-scrollbar">
            {/* All Subjects Pill */}
            <button
              onClick={() => setSelectedSubject('All')}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 border ${
                selectedSubject === 'All'
                  ? 'bg-[#1F2937] text-white border-[#1F2937] shadow-xs'
                  : 'bg-[#F3F4F6] text-gray-600 border-transparent hover:bg-gray-200'
              }`}
            >
              <span>All Subjects</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                selectedSubject === 'All' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {taskCounts.total}
              </span>
            </button>

            {/* Individual Subject Pills */}
            {allSubjectsList.map((subjectName) => {
              const subColor = SUBJECT_COLORS[subjectName as Subject] || SUBJECT_COLORS.Other;
              const isSelected = selectedSubject === subjectName;
              const count = taskCounts.subjectCounts[subjectName] || 0;

              return (
                <button
                  key={subjectName}
                  onClick={() => setSelectedSubject(isSelected ? 'All' : subjectName)}
                  className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5 border ${
                    isSelected
                      ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-sm'
                      : `${subColor.bg} ${subColor.text} ${subColor.border} hover:opacity-80`
                  }`}
                >
                  <span>{subjectName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-gray-700 shadow-2xs'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. SEARCH, URGENCY, PRIORITY & SORT DROPDOWNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {/* Search input with Clear button */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, rubrics, subjects..."
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-[#F3F4F6]/50 hover:bg-white transition-colors font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Urgency Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value as UrgencyFilter)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-[#F3F4F6]/50 hover:bg-white transition-colors font-bold text-gray-700 appearance-none cursor-pointer"
            >
              <option value="all">⚡ All Urgencies ({taskCounts.pending} active)</option>
              <option value="overdue">⚠️ Past Due / Overdue ({taskCounts.overdue})</option>
              <option value="today">📅 Due Today ({taskCounts.today})</option>
              <option value="thisWeek">⏳ Due This Week ({taskCounts.thisWeek})</option>
              <option value="upcoming">🚀 Upcoming / Later ({taskCounts.upcoming})</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>

          {/* Priority Level Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-[#F3F4F6]/50 hover:bg-white transition-colors font-bold text-gray-700 appearance-none cursor-pointer"
            >
              <option value="All">🎯 All Priorities ({taskCounts.total})</option>
              <option value="High">🔥 High Priority (+30 XP) ({taskCounts.high})</option>
              <option value="Medium">⚡ Medium Priority (+20 XP) ({taskCounts.medium})</option>
              <option value="Low">🌱 Low Priority (+10 XP) ({taskCounts.low})</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-[#8B5CF6] bg-[#F3F4F6]/50 hover:bg-white transition-colors font-bold text-gray-700 appearance-none cursor-pointer"
            >
              <option value="urgency">Sort: Most Urgent First</option>
              <option value="dueDate">Sort: Due Date (Earliest)</option>
              <option value="priority">Sort: Priority (High → Low)</option>
              <option value="xp">Sort: XP Value (Highest)</option>
              <option value="title">Sort: Title (A → Z)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* 5. STATUS SEGMENT CONTROL & ACTIVE FILTER SUMMARY */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <div className="flex bg-[#F3F4F6] p-1.5 rounded-2xl">
            <button
              type="button"
              onClick={() => setSelectedStatus('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === 'all'
                  ? 'bg-white text-[#8B5CF6] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All ({taskCounts.total})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('pending')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === 'pending'
                  ? 'bg-white text-[#8B5CF6] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              In Progress ({taskCounts.pending})
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatus('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                selectedStatus === 'completed'
                  ? 'bg-white text-[#8B5CF6] shadow-xs'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Completed ({taskCounts.completed})
            </button>
          </div>

          {/* Active Filters Display & Clear Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 font-bold">
              Showing <span className="text-[#1F2937] font-black">{sortedTasks.length}</span> of {taskCounts.total} tasks
            </span>

            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-xl bg-purple-50 text-[#8B5CF6] hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>

        {/* 6. APPLIED FILTER CHIPS ROW (If filtered) */}
        {isFiltered && (
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Active Filters:
            </span>

            {selectedUrgency !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <span>Urgency: {selectedUrgency === 'overdue' ? 'Past Due' : selectedUrgency === 'today' ? 'Due Today' : selectedUrgency === 'thisWeek' ? 'Due This Week' : 'Upcoming'}</span>
                <button onClick={() => setSelectedUrgency('all')} className="hover:text-amber-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedPriority !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">
                <span>Priority: {selectedPriority}</span>
                <button onClick={() => setSelectedPriority('All')} className="hover:text-rose-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSubject !== 'All' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-50 text-[#6D28D9] border border-purple-200">
                <span>Subject: {selectedSubject}</span>
                <button onClick={() => setSelectedSubject('All')} className="hover:text-purple-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <span>Search: "{searchQuery}"</span>
                <button onClick={() => setSearchQuery('')} className="hover:text-blue-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedStatus !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold bg-gray-100 text-gray-800 border border-gray-200">
                <span>Status: {selectedStatus === 'pending' ? 'In Progress' : 'Completed'}</span>
                <button onClick={() => setSelectedStatus('all')} className="hover:text-gray-950">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* 7. TASKS CONTENT LISTS */}
      <div className="space-y-6">
        {/* IN PROGRESS / ACTIVE ASSIGNMENTS */}
        {selectedStatus !== 'completed' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-heading font-bold text-base sm:text-lg text-[#1F2937] flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                Active Assignments ({pendingTasks.length})
              </h3>
              <span className="text-xs text-[#8B5CF6] font-bold">
                Total XP available: +{pendingTasks.reduce((acc, t) => acc + t.xpValue, 0)} XP
              </span>
            </div>

            {pendingTasks.length === 0 ? (
              <div className="bg-white rounded-3xl border border-gray-100 p-10 text-center shadow-xs">
                <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto mb-2" />
                <h4 className="font-heading font-bold text-lg text-[#1F2937]">
                  {isFiltered ? 'No active tasks match current filters' : 'No active tasks found'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-sm mx-auto mb-4 font-medium">
                  {isFiltered
                    ? 'Try relaxing your urgency, priority, or subject filters to view more homework.'
                    : "You've crushed all active homework! Add a new task to earn more XP."}
                </p>
                {isFiltered ? (
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-purple-50 text-[#8B5CF6] hover:bg-purple-100 rounded-2xl text-xs font-bold transition-colors"
                  >
                    Reset All Filters
                  </button>
                ) : (
                  <button
                    onClick={onOpenAddTask}
                    className="px-5 py-2.5 bg-[#8B5CF6] text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200 hover:bg-[#6D28D9] transition-colors"
                  >
                    + Create New Task
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingTasks.map((task) => {
                  const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Other;
                  const isOverdue = task.dueDate < todayStr;
                  const isDueToday = task.dueDate === todayStr;

                  // Border indicator
                  const priorityBorder = isOverdue
                    ? 'border-l-4 border-[#EF4444]'
                    : isDueToday
                    ? 'border-l-4 border-[#F59E0B]'
                    : task.priority === 'High'
                    ? 'border-l-4 border-rose-400'
                    : task.priority === 'Medium'
                    ? 'border-l-4 border-amber-400'
                    : 'border-l-4 border-emerald-400';

                  const priorityBadge =
                    task.priority === 'High'
                      ? 'bg-red-100 text-[#EF4444]'
                      : task.priority === 'Medium'
                      ? 'bg-orange-100 text-[#F59E0B]'
                      : 'bg-emerald-100 text-[#10B981]';

                  return (
                    <div
                      key={task.id}
                      className={`bg-white rounded-3xl p-5 sm:p-6 border border-gray-100 ${priorityBorder} hover:shadow-md transition-shadow flex flex-col justify-between group`}
                    >
                      <div>
                        {/* Header Tags: Subject, Priority, Urgency, XP */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Clickable Subject Label */}
                            <button
                              type="button"
                              onClick={() => setSelectedSubject(task.subject)}
                              title={`Filter by ${task.subject}`}
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${subjectColor.bg} ${subjectColor.text} hover:opacity-80 transition-opacity`}
                            >
                              {task.subject}
                            </button>

                            {/* Clickable Priority Label */}
                            <button
                              type="button"
                              onClick={() => setSelectedPriority(task.priority)}
                              title={`Filter by ${task.priority} Priority`}
                              className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg ${priorityBadge} hover:opacity-80 transition-opacity`}
                            >
                              {task.priority}
                            </button>

                            {/* Urgency Badge */}
                            {isOverdue && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#EF4444] text-white flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Overdue
                              </span>
                            )}
                            {isDueToday && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[#F59E0B] text-white flex items-center gap-1">
                                <Flame className="w-3 h-3 fill-current" />
                                Today
                              </span>
                            )}
                          </div>

                          <span className="text-xs font-heading font-black text-[#6D28D9] bg-purple-50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-purple-100 shrink-0">
                            <Sparkles className="w-3 h-3 text-[#8B5CF6]" />
                            +{task.xpValue} XP
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h4 className="font-heading font-bold text-base sm:text-lg text-[#1F2937] group-hover:text-[#6D28D9] transition-colors leading-snug">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-xs sm:text-sm text-gray-500 mt-1.5 line-clamp-2 leading-relaxed font-medium">
                            {task.description}
                          </p>
                        )}
                      </div>

                      {/* Card Footer: Due date + Actions */}
                      <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                        <div
                          className={`flex items-center gap-1.5 text-xs font-bold ${
                            isOverdue
                              ? 'text-[#EF4444]'
                              : isDueToday
                              ? 'text-[#F59E0B]'
                              : 'text-gray-400'
                          }`}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{formatDueDate(task.dueDate, task.completed)}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {/* Focus Button */}
                          <button
                            onClick={() => {
                              setActiveFocusTaskId(task.id);
                              setCurrentTab('focus');
                            }}
                            title="Start Focus Timer for this assignment"
                            className="p-2 rounded-xl text-gray-400 hover:text-[#8B5CF6] hover:bg-purple-50 transition-colors"
                          >
                            <Zap className="w-4 h-4 fill-current" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => onEditTask(task)}
                            title="Edit task"
                            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => deleteTask(task.id)}
                            title="Delete task"
                            className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Complete Button */}
                          <button
                            onClick={() => toggleCompleteTask(task.id)}
                            className="ml-1 px-3.5 py-2 bg-[#8B5CF6] hover:bg-[#6D28D9] active:bg-purple-800 text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200 flex items-center gap-1.5 transition-colors"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Done (+{task.xpValue} XP)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* COMPLETED TASKS SECTION */}
        {selectedStatus !== 'pending' && completedTasks.length > 0 && (
          <div className="space-y-3 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-heading font-bold text-base text-gray-700 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                Completed Tasks ({completedTasks.length})
              </h3>
              <span className="text-xs text-[#10B981] font-black uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                All XP Collected!
              </span>
            </div>

            <div className="space-y-2.5">
              {completedTasks.map((task) => {
                const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Other;
                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between gap-3 text-gray-500 transition-shadow hover:shadow-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={() => toggleCompleteTask(task.id)}
                        className="w-7 h-7 rounded-xl bg-[#10B981] text-white flex items-center justify-center shrink-0 hover:bg-emerald-600 transition-colors shadow-xs"
                        title="Click to unmark"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                      </button>

                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-gray-700 line-through truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-xs mt-0.5 font-semibold text-gray-400">
                          <button
                            type="button"
                            onClick={() => setSelectedSubject(task.subject)}
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${subjectColor.bg} ${subjectColor.text} hover:opacity-80`}
                          >
                            {task.subject}
                          </button>
                          <span>Completed on {new Date(task.completedAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-xl">
                        +{task.xpValue} XP Earned
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
