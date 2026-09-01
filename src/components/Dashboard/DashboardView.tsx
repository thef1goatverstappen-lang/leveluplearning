import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { getLevelTitle, getTodayDateString, PRIORITY_CONFIG, SUBJECT_COLORS } from '../../services/storage';
import {
  Trophy,
  Sparkles,
  Flame,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Plus,
  Calendar,
  Zap,
  Target,
  ChevronRight,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenAddTask: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenAddTask }) => {
  const {
    userProfile,
    stats,
    tasks,
    toggleCompleteTask,
    setCurrentTab,
    completeFocusSession,
    setActiveFocusTaskId,
  } = useApp();

  // Mini Focus Timer state on Dashboard
  const [timerSeconds, setTimerSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      if (timerMode === 'focus') {
        completeFocusSession(25, undefined, 'Dashboard Quick Focus Session');
        setTimerMode('break');
        setTimerSeconds(5 * 60);
      } else {
        setTimerMode('focus');
        setTimerSeconds(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const handleStartPauseTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(timerMode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const handleSwitchMode = (mode: 'focus' | 'break') => {
    setIsTimerRunning(false);
    setTimerMode(mode);
    setTimerSeconds(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // XP Progress calculation
  const currentLevelXP = stats.totalXP % 1000;
  const xpNeeded = 1000;
  const xpPercent = Math.min(100, Math.round((currentLevelXP / xpNeeded) * 100));

  // Daily Tasks Goal calculation
  const today = getTodayDateString();
  const todayCompletedTasks = tasks.filter(
    (t) => t.completed && t.completedAt && t.completedAt.startsWith(today)
  ).length;
  const targetGoal = userProfile.dailyGoalTarget || 4;
  const dailyGoalPercent = Math.min(100, Math.round((todayCompletedTasks / targetGoal) * 100));

  // Upcoming non-completed tasks (sorted by due date)
  const upcomingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  const formatDueDate = (dateString: string) => {
    if (dateString === today) return 'Due Today';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    if (dateString === tomorrowStr) return 'Due Tomorrow';
    return `Due ${new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })}`;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. WELCOME SECTION & MOTIVATION BANNER */}
      <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-200 relative overflow-hidden">
        {/* Abstract background decorative accents */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 -mb-10 w-48 h-48 bg-indigo-300/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-purple-100 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                {userProfile.grade} Dashboard
              </span>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Flame className="w-3.5 h-3.5 fill-white" />
                {stats.currentStreak} Day Streak
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl tracking-tight">
              Welcome back, {userProfile.name}! 👋
            </h2>
            <p className="text-purple-100 text-sm sm:text-base font-medium">
              You're making great progress towards your next level! Tackle high-priority assignments and log your focus time to earn bonus XP.
            </p>
          </div>

          {/* Quick Actions in Banner */}
          <div className="flex sm:flex-row md:flex-col gap-3 shrink-0">
            <button
              onClick={onOpenAddTask}
              className="px-5 py-3 bg-white text-[#6D28D9] hover:bg-purple-50 font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Assignment</span>
            </button>
            <button
              onClick={() => setCurrentTab('focus')}
              className="px-5 py-3 bg-[#6D28D9]/70 hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2 min-h-[44px]"
            >
              <Clock className="w-4 h-4" />
              <span>Open Focus Zone</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. FOUR STATISTICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Level Card */}
        <div
          onClick={() => setCurrentTab('rewards')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Current Level</span>
            <div className="w-10 h-10 rounded-2xl bg-purple-50 group-hover:bg-purple-100 text-[#8B5CF6] flex items-center justify-center transition-colors">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#1F2937] tracking-tight">
              Level {stats.level}
            </span>
          </div>
          <p className="text-xs font-bold text-[#8B5CF6] mt-1.5 truncate">
            {getLevelTitle(stats.level)}
          </p>
        </div>

        {/* Current XP Card */}
        <div
          onClick={() => setCurrentTab('rewards')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Current XP</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 group-hover:bg-indigo-100 text-[#8B5CF6] flex items-center justify-center transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#1F2937] tracking-tight">
              {currentLevelXP}
            </span>
            <span className="text-xs font-bold text-gray-400">/ 1000 XP</span>
          </div>
          <p className="text-xs font-semibold text-gray-500 mt-1.5">
            {1000 - currentLevelXP} XP to Level {stats.level + 1}
          </p>
        </div>

        {/* Current Streak Card */}
        <div
          onClick={() => setCurrentTab('progress')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Study Streak</span>
            <div className="w-10 h-10 rounded-2xl bg-orange-50 group-hover:bg-orange-100 text-orange-500 flex items-center justify-center transition-colors">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-black text-3xl sm:text-4xl text-orange-600 tracking-tight">
              {stats.currentStreak}
            </span>
            <span className="text-xs font-bold text-gray-500">Days</span>
          </div>
          <p className="text-xs text-orange-600 font-bold mt-1.5">
            Best streak: {stats.longestStreak} days
          </p>
        </div>

        {/* Tasks Completed Card */}
        <div
          onClick={() => setCurrentTab('tasks')}
          className="bg-white p-5 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider">Tasks Done</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-[#10B981] flex items-center justify-center transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#10B981] tracking-tight">
              {tasks.filter((t) => t.completed).length}
            </span>
            <span className="text-xs font-bold text-gray-400">Total Done</span>
          </div>
          <p className="text-xs text-emerald-700 font-bold mt-1.5">
            {tasks.filter((t) => !t.completed).length} pending tasks
          </p>
        </div>
      </div>

      {/* 3. XP PROGRESS BAR & DAILY GOAL ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* XP Progress Bar Card */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-200">
                Lv.{stats.level}
              </div>
              <div>
                <h3 className="font-heading font-bold text-base sm:text-lg text-[#1F2937]">
                  Level {stats.level} Rank Progress
                </h3>
                <p className="text-xs text-gray-400 font-medium">
                  Earn 1,000 XP per level to rank up & unlock badges
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="font-heading font-black text-lg sm:text-xl text-[#6D28D9]">
                {xpPercent}%
              </span>
              <span className="block text-[11px] text-gray-400 font-bold">
                {currentLevelXP} / 1000 XP
              </span>
            </div>
          </div>

          {/* Large Animated XP Bar */}
          <div className="h-4 w-full bg-[#F3F4F6] rounded-full overflow-hidden p-0.5 border border-purple-100">
            <div
              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-full transition-all duration-700 shadow-xs"
              style={{ width: `${xpPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-bold pt-1">
            <span className="text-gray-500">Current: {getLevelTitle(stats.level)}</span>
            <span className="text-[#8B5CF6]">
              Next: Level {stats.level + 1} ({getLevelTitle(stats.level + 1)})
            </span>
          </div>
        </div>

        {/* Daily Goal Card */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#8B5CF6]" />
                <h3 className="font-heading font-bold text-base text-[#1F2937]">
                  Daily Goal
                </h3>
              </div>
              <span className="text-xs font-black text-[#10B981] bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                {dailyGoalPercent}%
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              Complete {targetGoal} tasks today to maintain your study streak.
            </p>
          </div>

          <div className="my-4">
            <div className="flex justify-between text-xs font-bold text-[#1F2937] mb-2">
              <span>{todayCompletedTasks} of {targetGoal} completed</span>
              <span className="text-[#8B5CF6]">
                {targetGoal - todayCompletedTasks > 0 ? `${targetGoal - todayCompletedTasks} remaining` : 'Target Met! 🎉'}
              </span>
            </div>
            <div className="h-3 w-full bg-[#F3F4F6] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${dailyGoalPercent}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('tasks')}
            className="text-xs text-[#8B5CF6] hover:text-[#6D28D9] font-bold flex items-center justify-between pt-3 border-t border-gray-100"
          >
            <span>View all assignments</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4. UPCOMING TASKS & COMPACT FOCUS TIMER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upcoming Tasks Section (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1F2937] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#8B5CF6]" />
                Upcoming Deadlines
              </h3>
              <p className="text-xs text-gray-400 font-medium">
                High-priority assignments & homework
              </p>
            </div>

            <button
              onClick={() => setCurrentTab('tasks')}
              className="text-xs font-bold text-[#8B5CF6] hover:text-[#6D28D9] flex items-center gap-1.5 hover:underline"
            >
              <span>Task Manager</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className="text-center py-10 bg-purple-50/50 rounded-2xl border border-dashed border-purple-200">
              <CheckCircle2 className="w-10 h-10 text-[#8B5CF6] mx-auto mb-2" />
              <p className="font-heading font-bold text-base text-gray-800">
                All caught up on deadlines!
              </p>
              <p className="text-xs text-gray-500 mt-1 mb-4 font-medium">
                Create a new study goal or review upcoming lessons.
              </p>
              <button
                onClick={onOpenAddTask}
                className="px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#6D28D9] text-white rounded-2xl text-xs font-bold shadow-md shadow-purple-200 transition-all"
              >
                + Add New Task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const subjectColor = SUBJECT_COLORS[task.subject] || SUBJECT_COLORS.Other;
                
                // Priority border color
                const borderBorderClass = 
                  task.priority === 'Urgent' || task.priority === 'High' 
                    ? 'border-l-4 border-[#EF4444]' 
                    : task.priority === 'Medium' 
                    ? 'border-l-4 border-[#F59E0B]' 
                    : 'border-l-4 border-[#10B981]';

                const priorityTagClass = 
                  task.priority === 'Urgent' || task.priority === 'High'
                    ? 'bg-red-100 text-[#EF4444]'
                    : task.priority === 'Medium'
                    ? 'bg-orange-100 text-[#F59E0B]'
                    : 'bg-emerald-100 text-[#10B981]';

                return (
                  <div
                    key={task.id}
                    className={`p-4 bg-[#F3F4F6] rounded-2xl ${borderBorderClass} hover:shadow-xs transition-all flex items-center justify-between gap-3`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Checkbox Complete button */}
                      <button
                        onClick={() => toggleCompleteTask(task.id)}
                        className="w-7 h-7 rounded-xl border-2 border-gray-300 hover:border-[#8B5CF6] flex items-center justify-center text-transparent hover:text-[#8B5CF6] transition-colors shrink-0 group min-w-[32px] min-h-[32px] bg-white shadow-xs"
                        title="Mark Complete & Earn XP"
                      >
                        <Circle className="w-5 h-5 text-gray-300 group-hover:text-[#8B5CF6]" />
                      </button>

                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-[#1F2937] truncate">
                          {task.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                          {/* Subject Pill */}
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg ${subjectColor.bg} ${subjectColor.text}`}
                          >
                            {task.subject}
                          </span>

                          {/* Due date */}
                          <span className="text-xs text-gray-400 font-semibold">
                            {formatDueDate(task.dueDate)}
                          </span>

                          {/* Priority Pill */}
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg ${priorityTagClass}`}
                          >
                            {task.priority} (+{task.xpValue} XP)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Focus Launch */}
                    <button
                      onClick={() => {
                        setActiveFocusTaskId(task.id);
                        setCurrentTab('focus');
                      }}
                      title="Focus on this task"
                      className="p-2.5 rounded-xl text-gray-400 hover:text-[#8B5CF6] hover:bg-white transition-colors shrink-0"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Compact Focus Timer Section (1 Column) */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase text-gray-400 tracking-widest">
                Focus Zone
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-100 text-[#6D28D9]">
                +25 XP
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 bg-[#F3F4F6] p-1.5 rounded-2xl mb-4">
              <button
                type="button"
                onClick={() => handleSwitchMode('focus')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  timerMode === 'focus'
                    ? 'bg-white text-[#1F2937] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                25m Study
              </button>
              <button
                type="button"
                onClick={() => handleSwitchMode('break')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  timerMode === 'break'
                    ? 'bg-white text-[#10B981] shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                5m Break
              </button>
            </div>

            {/* Time Countdown Display */}
            <div className="text-center py-4">
              <div className="font-mono font-black text-5xl sm:text-6xl text-[#1F2937] tracking-tighter">
                {formatTime(timerSeconds)}
              </div>
              <p className="text-xs font-bold text-[#8B5CF6] mt-2">
                {timerMode === 'focus' ? 'Deep Study Session' : 'Refresh & Recharge'}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="space-y-3 pt-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleStartPauseTimer}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 shadow-md transition-all min-h-[44px] ${
                  isTimerRunning
                    ? 'bg-[#F59E0B] hover:bg-amber-600 shadow-amber-200'
                    : 'bg-[#1F2937] hover:bg-black shadow-gray-300'
                }`}
              >
                {isTimerRunning ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Session</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleResetTimer}
                className="p-3 rounded-2xl border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setCurrentTab('focus')}
              className="w-full py-2 text-xs font-bold text-[#8B5CF6] hover:text-[#6D28D9] text-center"
            >
              Open Full Focus Zone & Ambient Sounds →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
