import React from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Sparkles, Star, ArrowRight } from 'lucide-react';

export const LevelUpModal: React.FC = () => {
  const { levelUpModal, closeLevelUpModal, setCurrentTab } = useApp();

  if (!levelUpModal.isOpen) return null;

  const handleGoToRewards = () => {
    closeLevelUpModal();
    setCurrentTab('rewards');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-purple-100 text-center relative overflow-hidden transform scale-100 transition-transform">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-3xl" />

        {/* Level Up Badge Icon */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 flex items-center justify-center text-white shadow-xl shadow-purple-500/30 transform -rotate-3 hover:rotate-0 transition-transform">
            <Trophy className="w-12 h-12 text-yellow-300 animate-pulse" />
          </div>
          <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-950 p-1.5 rounded-xl shadow-md">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-purple-800 text-purple-100 p-1.5 rounded-xl shadow-md">
            <Star className="w-4 h-4" />
          </div>
        </div>

        {/* Title & Message */}
        <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-3 py-1 rounded-full inline-block mb-2">
          New Rank Achieved!
        </span>
        <h2 className="font-heading font-extrabold text-3xl text-gray-900 mb-1">
          LEVEL {levelUpModal.level}!
        </h2>
        <p className="font-heading font-semibold text-lg text-purple-700 mb-4">
          "{levelUpModal.title}"
        </p>

        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Incredible dedication! You reached a new milestone on Level Up Learning. New rewards, badges, and study perks are waiting for you in the Rewards Shop.
        </p>

        {/* Level Perks Box */}
        <div className="bg-purple-50/70 border border-purple-100 rounded-2xl p-4 mb-6 text-left text-xs text-gray-700 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span className="font-semibold text-gray-900">1000 XP Milestone reached</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Title updated across leaderboard & profile</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-600" />
            <span>Eligible for new reward shop themes & boosters</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleGoToRewards}
            className="flex-1 px-4 py-3 bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
          >
            <span>View Rewards</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={closeLevelUpModal}
            className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-purple-600/25 transition-all min-h-[44px]"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};
