import React from 'react';
import { useApp } from '../../context/AppContext';
import { getLevelTitle, getDateOffset, getTodayDateString } from '../../services/storage';
import {
  TrendingUp,
  Flame,
  CheckCircle2,
  Clock,
  Trophy,
  Sparkles,
  Calendar,
  Zap,
  BarChart3,
  Award,
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { stats, tasks, xpLogs, focusSessions } = useApp();

  // Weekly tasks calculation (Past 7 days)
  const past7Days = Array.from({ length: 7 }, (_, i) => {
    const offset = 6 - i;
    const ymd = getDateOffset(-offset);
    const dateObj = new Date(ymd + 'T00:00:00');
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNumber = dateObj.getDate();

    const completedOnDay = tasks.filter(
      (t) => t.completed && t.completedAt && t.completedAt.startsWith(ymd)
    ).length;

    const focusMinutesOnDay = focusSessions
      .filter((s) => s.completedAt.startsWith(ymd))
      .reduce((sum, s) => sum + s.durationMinutes, 0);

    return {
      ymd,
      dayName,
      dayNumber,
      completedTasks: completedOnDay,
      focusMinutes: focusMinutesOnDay,
      isToday: ymd === getTodayDateString(),
    };
  });

  const maxWeeklyTasks = Math.max(...past7Days.map((d) => d.completedTasks), 4);

  // Productivity metrics
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Study time
  const totalFocusMinutes = stats.totalFocusMinutes || 0;
  const totalHours = (totalFocusMinutes / 60).toFixed(1);
  const weeklyFocusMinutes = past7Days.reduce((acc, d) => acc + d.focusMinutes, 0);
  const weeklyHours = (weeklyFocusMinutes / 60).toFixed(1);

  // Current level info
  const currentLevelXP = stats.totalXP % 1000;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / 1000) * 100));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Top Header */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#8B5CF6]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F2937]">
                Learning Analytics & Progress
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Track your study habits, homework completion velocity, and streak consistency
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Rank:</span>
            <span className="px-3.5 py-1.5 bg-purple-50 text-[#6D28D9] font-heading font-black text-xs rounded-2xl border border-purple-200">
              Level {stats.level} ({getLevelTitle(stats.level)})
            </span>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Completion Rate</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1F2937]">
            {completionRate}%
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {completedTasksCount} of {totalTasks} tasks completed
          </p>
        </div>

        {/* Total Study Time */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Total Study Time</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1F2937]">
            {totalHours} <span className="text-sm font-bold text-gray-400 uppercase">hrs</span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {weeklyHours} hrs studied this week
          </p>
        </div>

        {/* Focus Sessions */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Focus Sessions</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
              <Zap className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="font-heading font-black text-3xl sm:text-4xl text-[#1F2937]">
            {stats.totalFocusSessions || 0}
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            {stats.totalFocusMinutes} total deep focus mins
          </p>
        </div>

        {/* Streak Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-gray-400 tracking-wider">Streak Record</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#F59E0B] flex items-center justify-center">
              <Flame className="w-4 h-4 fill-current" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading font-black text-3xl sm:text-4xl text-[#F59E0B]">
              {stats.currentStreak}
            </span>
            <span className="text-xs text-gray-400 font-black">/ Best: {stats.longestStreak} days</span>
          </div>
          <p className="text-xs text-orange-700/80 font-bold mt-1">
            Continuous daily check-ins
          </p>
        </div>
      </div>

      {/* Visual Graphs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Tasks Completed Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-[#1F2937] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#8B5CF6]" />
                Weekly Tasks Completed (7-Day Overview)
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Number of homework assignments completed each day
              </p>
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="pt-6 pb-2">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2">
              {past7Days.map((day) => {
                const heightPercent = maxWeeklyTasks > 0
                  ? Math.max(8, (day.completedTasks / maxWeeklyTasks) * 100)
                  : 8;

                return (
                  <div key={day.ymd} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    {/* Tooltip on hover */}
                    <span className="text-[11px] font-black text-[#6D28D9] opacity-0 group-hover:opacity-100 transition-opacity bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                      {day.completedTasks} done
                    </span>

                    {/* Bar */}
                    <div className="w-full max-w-[42px] bg-[#F3F4F6] rounded-t-2xl overflow-hidden relative flex items-end">
                      <div
                        className={`w-full rounded-t-2xl transition-all duration-700 ${
                          day.isToday
                            ? 'bg-[#8B5CF6] shadow-sm'
                            : 'bg-purple-300 group-hover:bg-[#8B5CF6]'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <div className="text-center">
                      <span className={`block text-xs font-bold ${day.isToday ? 'text-[#8B5CF6]' : 'text-gray-600'}`}>
                        {day.dayName}
                      </span>
                      <span className="block text-[10px] font-black text-gray-400">
                        {day.dayNumber}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level & XP Breakdown Card */}
        <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="font-heading font-bold text-lg text-[#1F2937]">
                Level Progress
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              {1000 - currentLevelXP} XP needed to reach Level {stats.level + 1}
            </p>
          </div>

          <div className="text-center py-5 bg-[#F3F4F6]/50 rounded-3xl border border-gray-100">
            <div className="w-16 h-16 rounded-2xl bg-[#8B5CF6] text-white flex items-center justify-center text-2xl font-heading font-black mx-auto shadow-lg shadow-purple-200 mb-2">
              {stats.level}
            </div>
            <span className="font-heading font-bold text-sm text-[#1F2937]">
              {getLevelTitle(stats.level)}
            </span>
            <div className="mt-4 px-4">
              <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                <span>{currentLevelXP} XP</span>
                <span>1000 XP</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-gray-600 space-y-2 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Lifetime XP Earned:</span>
              <span className="font-black text-[#6D28D9]">{stats.totalXP} XP</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-500">Streak Multiplier:</span>
              <span className="font-black text-[#F59E0B]">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* XP Log History Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#1F2937] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#8B5CF6]" />
              Recent XP History
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Activity log of points earned from homework completion, study sessions, and milestones
            </p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {xpLogs.slice(0, 8).map((log) => (
            <div key={log.id} className="py-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3.5">
                <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold ${
                  log.type === 'task' ? 'bg-emerald-50 text-[#10B981]' :
                  log.type === 'focus' ? 'bg-purple-50 text-[#8B5CF6]' :
                  'bg-yellow-50 text-[#F59E0B]'
                }`}>
                  {log.type === 'task' ? '✓' : log.type === 'focus' ? '⏱' : '★'}
                </div>
                <div>
                  <span className="font-bold text-[#1F2937] text-sm block sm:inline">
                    {log.reason}
                  </span>
                  <span className="text-xs text-gray-400 font-medium sm:ml-2">
                    {new Date(log.timestamp).toLocaleDateString()} at {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <span className="font-heading font-black text-sm text-[#6D28D9] shrink-0 bg-purple-50 px-3 py-1 rounded-full border border-purple-100">
                +{log.amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
