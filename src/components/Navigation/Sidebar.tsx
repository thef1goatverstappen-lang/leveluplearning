import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Clock,
  TrendingUp,
  Trophy,
  User,
  LogOut,
  Sparkles,
  Flame,
  X,
} from 'lucide-react';
import { getLevelTitle } from '../../services/storage';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, userProfile, stats, logout } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    { id: 'focus', label: 'Focus Zone', icon: Clock },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  const levelProgress = stats.totalXP % 1000;
  const levelProgressPercent = Math.min(100, Math.round((levelProgress / 1000) * 100));

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-gray-900/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* App Branding Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-purple-200">
              <span className="font-heading font-black text-lg tracking-tighter">LVL</span>
            </div>
            <div>
              <span className="font-heading font-bold text-xl text-[#6D28D9] tracking-tight block">
                Level Up
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
                {userProfile.grade} Edition
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Level Card in Sidebar */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50/70 rounded-2xl p-4 border border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-purple-100 flex items-center justify-center text-2xl">
                {userProfile.avatar || '🚀'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-sm text-gray-900 truncate">
                    {userProfile.name}
                  </h4>
                  <span className="text-xs font-black px-2.5 py-0.5 bg-[#8B5CF6] text-white rounded-full">
                    Lv. {stats.level}
                  </span>
                </div>
                <p className="text-xs text-[#6D28D9] font-semibold truncate mt-0.5">
                  {getLevelTitle(stats.level)}
                </p>
              </div>
            </div>

            {/* XP Mini Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-gray-500 mb-1">
                <span>XP Progress</span>
                <span className="text-[#8B5CF6]">{levelProgress} / 1000 XP</span>
              </div>
              <div className="h-2 w-full bg-purple-200/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-full transition-all duration-500 shadow-xs"
                  style={{ width: `${levelProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Streak Indicator */}
            <div className="mt-2.5 flex items-center justify-between text-xs bg-white/90 py-1.5 px-3 rounded-xl border border-purple-100 shadow-xs">
              <span className="flex items-center gap-1.5 font-bold text-gray-700">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
                Streak
              </span>
              <span className="font-black text-orange-600">{stats.currentStreak} Days</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm transition-all duration-200 min-h-[46px] ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-100 font-bold'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-semibold'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-[#8B5CF6]'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'rewards' && (
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-purple-700 text-purple-100' : 'bg-purple-100 text-[#6D28D9]'
                    }`}
                  >
                    +XP
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Logout Button */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors min-h-[44px]"
          >
            <LogOut className="w-5 h-5 text-gray-400 hover:text-red-500" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
