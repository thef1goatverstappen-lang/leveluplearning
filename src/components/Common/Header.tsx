import React from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, Plus, Flame, Sparkles, Clock } from 'lucide-react';
import { getLevelTitle } from '../../services/storage';

interface HeaderProps {
  onOpenMobileNav: () => void;
  onOpenAddTask: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileNav, onOpenAddTask }) => {
  const { currentTab, setCurrentTab, stats, userProfile } = useApp();

  const getPageTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { title: 'Dashboard', subtitle: 'Track your assignments, streaks, and study progress' };
      case 'tasks':
        return { title: 'Task Manager', subtitle: 'Organize homework, assignments & projects' };
      case 'calendar':
        return { title: 'Study Calendar', subtitle: 'View upcoming deadlines and schedule focus time' };
      case 'focus':
        return { title: 'Focus Zone', subtitle: 'Pomodoro timer with distraction-free ambient audio' };
      case 'progress':
        return { title: 'Progress & Analytics', subtitle: 'Detailed study habits, XP logs, and completion rates' };
      case 'rewards':
        return { title: 'Rewards & Achievements', subtitle: 'Unlock achievement badges and level perks' };
      case 'profile':
        return { title: 'Student Profile', subtitle: 'Customize your grade, subjects & study settings' };
      default:
        return { title: 'Level Up Learning', subtitle: 'Gamified student planner' };
    }
  };

  const { title, subtitle } = getPageTitle();
  const levelProgress = stats.totalXP % 1000;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 rounded-2xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#1F2937] tracking-tight truncate">
            {title}
          </h1>
          <p className="hidden sm:block text-xs sm:text-sm text-gray-500 font-medium truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
        {/* Streak Pill */}
        <div
          title={`${stats.currentStreak} day study streak!`}
          className="bg-white px-3.5 sm:px-4 py-2 rounded-2xl shadow-xs border border-gray-200/80 flex items-center gap-2.5 cursor-pointer hover:border-orange-300 transition-colors"
          onClick={() => setCurrentTab('progress')}
        >
          <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
            <Flame className="w-4 h-4 fill-orange-500" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-none">
              Streak
            </span>
            <span className="font-heading font-black text-xs sm:text-sm text-orange-600 leading-tight">
              {stats.currentStreak} Days
            </span>
          </div>
        </div>

        {/* Level / XP Pill */}
        <div
          title={`Level ${stats.level}: ${levelProgress}/1000 XP towards next level`}
          className="hidden sm:flex bg-white px-3.5 sm:px-4 py-2 rounded-2xl shadow-xs border border-gray-200/80 items-center gap-2.5 cursor-pointer hover:border-purple-300 transition-colors"
          onClick={() => setCurrentTab('rewards')}
        >
          <div className="w-7 h-7 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white text-xs font-black shrink-0 shadow-sm shadow-purple-200">
            {stats.level}
          </div>
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-none">
              Total XP
            </span>
            <span className="font-heading font-black text-xs sm:text-sm text-[#6D28D9] leading-tight">
              {stats.totalXP} XP
            </span>
          </div>
        </div>

        {/* Quick Focus Button */}
        <button
          onClick={() => setCurrentTab('focus')}
          className="hidden md:flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-gray-700 bg-gray-50 hover:bg-purple-50 hover:text-[#6D28D9] rounded-2xl border border-gray-200 transition-all min-h-[44px]"
        >
          <Clock className="w-4 h-4 text-[#8B5CF6]" />
          <span>Focus Zone</span>
        </button>

        {/* Add Task Button */}
        <button
          onClick={onOpenAddTask}
          className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#6D28D9] active:bg-purple-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-lg shadow-purple-200 transition-all hover:scale-[1.02] min-h-[44px]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden xs:inline">Add Task</span>
          <span className="xs:hidden">New</span>
        </button>
      </div>
    </header>
  );
};
