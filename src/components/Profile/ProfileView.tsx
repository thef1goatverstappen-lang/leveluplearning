import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLevelTitle } from '../../services/storage';
import {
  User,
  Trophy,
  Flame,
  CheckCircle2,
  Sparkles,
  Award,
  Settings,
  Bell,
  Volume2,
  VolumeX,
  Palette,
  RotateCcw,
  Save,
  Check,
} from 'lucide-react';

const AVATARS = ['🚀', '🎓', '⚡', '🦉', '🎨', '💻', '🧪', '🔥', '🏆', '⭐'];

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    stats,
    achievements,
    tasks,
    resetAllData,
  } = useApp();

  const [name, setName] = useState(userProfile.name);
  const [grade, setGrade] = useState(userProfile.grade);
  const [motto, setMotto] = useState(userProfile.motto);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [dailyGoalTarget, setDailyGoalTarget] = useState(userProfile.dailyGoalTarget || 4);
  const [soundEnabled, setSoundEnabled] = useState(userProfile.soundEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = useState(userProfile.notificationsEnabled);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      grade,
      motto,
      avatar,
      dailyGoalTarget,
      soundEnabled,
      notificationsEnabled,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const unlockedAchievementsCount = achievements.filter((a) => a.unlocked).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar Icon */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-3xl bg-[#8B5CF6] flex items-center justify-center text-4xl shadow-xl shadow-purple-500/20 border-4 border-white">
              {avatar}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-[#1F2937] text-white font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
              Lv. {stats.level}
            </div>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#1F2937]">
                {userProfile.name}
              </h2>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-purple-50 text-[#6D28D9] border border-purple-200">
                {userProfile.grade}
              </span>
              <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-50 text-indigo-700">
                {getLevelTitle(stats.level)}
              </span>
            </div>

            <p className="text-xs text-gray-400 font-medium">{userProfile.email}</p>

            <p className="text-sm text-gray-700 font-bold italic pt-1">
              "{userProfile.motto || 'Striving for excellence one assignment at a time!'}"
            </p>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-gray-100">
          <div className="bg-[#F3F4F6]/50 p-4 sm:p-5 rounded-3xl border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#8B5CF6] mb-1">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Total XP</span>
            </div>
            <span className="font-heading font-black text-2xl text-[#6D28D9]">
              {stats.totalXP}
            </span>
          </div>

          <div className="bg-[#F3F4F6]/50 p-4 sm:p-5 rounded-3xl border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#10B981] mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Tasks Done</span>
            </div>
            <span className="font-heading font-black text-2xl text-[#10B981]">
              {completedTasksCount}
            </span>
          </div>

          <div className="bg-[#F3F4F6]/50 p-4 sm:p-5 rounded-3xl border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#F59E0B] mb-1">
              <Flame className="w-4 h-4 fill-[#F59E0B]" />
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Streak</span>
            </div>
            <span className="font-heading font-black text-2xl text-[#F59E0B]">
              {stats.currentStreak} Days
            </span>
          </div>

          <div className="bg-[#F3F4F6]/50 p-4 sm:p-5 rounded-3xl border border-gray-100 text-center">
            <div className="flex items-center justify-center gap-1.5 text-amber-500 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">Badges</span>
            </div>
            <span className="font-heading font-black text-2xl text-amber-600">
              {unlockedAchievementsCount} Earned
            </span>
          </div>
        </div>
      </div>

      {/* Edit Profile & Preferences Form */}
      <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Settings className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="font-heading font-bold text-lg text-[#1F2937]">
              Student Settings & Preferences
            </h3>
          </div>

          {savedSuccess && (
            <span className="text-xs font-bold text-[#10B981] bg-emerald-50 px-3.5 py-1.5 rounded-full flex items-center gap-1 border border-emerald-200">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              Changes saved!
            </span>
          )}
        </div>

        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-2">
            Choose Student Avatar
          </label>
          <div className="flex flex-wrap gap-2.5">
            {AVATARS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => setAvatar(emoji)}
                className={`w-12 h-12 rounded-2xl text-xl flex items-center justify-center transition-all ${
                  avatar === emoji
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-200 scale-110'
                    : 'bg-[#F3F4F6] hover:bg-purple-50 text-gray-700'
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Grade Level
            </label>
            <select
              value={grade}
              onChange={(e: any) => setGrade(e.target.value)}
              className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors cursor-pointer"
            >
              <option value="Grade 9">Grade 9 (Freshman)</option>
              <option value="Grade 10">Grade 10 (Sophomore)</option>
              <option value="Grade 11">Grade 11 (Junior)</option>
              <option value="Grade 12">Grade 12 (Senior)</option>
            </select>
          </div>
        </div>

        {/* Motto & Daily Target */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Personal Study Motto / Goal
            </label>
            <input
              type="text"
              value={motto}
              onChange={(e) => setMotto(e.target.value)}
              placeholder="e.g. 4.0 GPA this term!"
              className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1.5">
              Daily Completed Tasks Target
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={dailyGoalTarget}
              onChange={(e) => setDailyGoalTarget(parseInt(e.target.value) || 4)}
              className="w-full px-4 py-3 text-sm font-bold border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#8B5CF6] focus:border-transparent bg-[#F3F4F6]/40 hover:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Sound & Notifications Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-3xl border border-gray-100 bg-[#F3F4F6]/50 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#8B5CF6] flex items-center justify-center">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-xs font-bold text-[#1F2937] block">Sound FX & Audio Chimes</span>
                <span className="text-[11px] text-gray-500 font-medium">XP chimes & timer bells</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-[#8B5CF6]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-5 rounded-3xl border border-gray-100 bg-[#F3F4F6]/50 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1F2937] block">In-App Notifications</span>
                <span className="text-[11px] text-gray-500 font-medium">Milestone alerts & level ups</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                notificationsEnabled ? 'bg-[#8B5CF6]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  notificationsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={resetAllData}
            className="text-xs font-bold text-[#EF4444] hover:text-red-700 flex items-center gap-1.5 p-2 rounded-xl hover:bg-rose-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Data (Alex Grade 10)</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-[#8B5CF6] hover:bg-[#6D28D9] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-purple-200 transition-all flex items-center justify-center gap-2 min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
