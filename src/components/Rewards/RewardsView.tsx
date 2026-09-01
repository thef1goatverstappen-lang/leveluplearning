import React from 'react';
import { useApp } from '../../context/AppContext';
import { getLevelTitle } from '../../services/storage';
import {
  Trophy,
  Sparkles,
  Target,
  CheckCircle2,
  Zap,
  Flame,
  Crown,
  Clock,
  Award,
  Lock,
  Check,
  Gift,
  Palette,
  Rocket,
  Shield,
  Sun,
  Star,
} from 'lucide-react';

export const RewardsView: React.FC = () => {
  const { stats, achievements, rewards, redeemReward, userProfile } = useApp();

  const currentLevelXP = stats.totalXP % 1000;
  const levelProgressPercent = Math.min(100, Math.round((currentLevelXP / 1000) * 100));

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return Target;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'Zap':
        return Zap;
      case 'Flame':
        return Flame;
      case 'Crown':
        return Crown;
      case 'Clock':
        return Clock;
      case 'Award':
        return Award;
      case 'Trophy':
      default:
        return Trophy;
    }
  };

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case 'Palette':
        return Palette;
      case 'Rocket':
        return Rocket;
      case 'Shield':
        return Shield;
      case 'Gift':
        return Gift;
      case 'Sun':
        return Sun;
      default:
        return Sparkles;
    }
  };

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* 1. CURRENT LEVEL HERO BANNER */}
      <div className="bg-[#8B5CF6] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-500/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-purple-100 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-yellow-300" />
                Rank & Level Showcase
              </span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-4xl tracking-tight">
              Level {stats.level}: {getLevelTitle(stats.level)}
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm max-w-lg font-medium">
              Earn XP by completing daily homework, meeting deadlines, and finishing study timers.
            </p>
          </div>

          {/* Level Circle & XP Counter */}
          <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 sm:p-6 border border-white/20 min-w-[280px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-purple-200">Level Progress</span>
              <span className="font-heading font-black text-sm text-yellow-300">
                {currentLevelXP} / 1000 XP
              </span>
            </div>
            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-yellow-300 rounded-full transition-all duration-700"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-3 text-xs text-purple-200 font-bold">
              <span>{1000 - currentLevelXP} XP to Level {stats.level + 1}</span>
              <span className="font-black text-white">Total: {stats.totalXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACHIEVEMENTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1F2937] flex items-center gap-2">
              <Award className="w-6 h-6 text-[#8B5CF6]" />
              Student Achievements ({unlockedCount}/{achievements.length})
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Complete milestones to unlock badges and bonus XP awards
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((ach) => {
            const Icon = getAchievementIcon(ach.icon);
            const isUnlocked = ach.unlocked;
            const progress = Math.min(ach.maxProgress, ach.progress);
            const percent = Math.min(100, Math.round((progress / ach.maxProgress) * 100));

            return (
              <div
                key={ach.id}
                className={`rounded-3xl p-5 border transition-all flex flex-col justify-between relative shadow-sm ${
                  isUnlocked
                    ? 'bg-white border-purple-200 shadow-sm hover:shadow-md'
                    : 'bg-[#F3F4F6]/50 border-gray-200/80 opacity-85'
                }`}
              >
                <div>
                  {/* Badge Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                        isUnlocked
                          ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-200'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    {isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <Check className="w-3 h-3 stroke-[3]" />
                        Unlocked
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-gray-500 bg-gray-200/80 px-2.5 py-1 rounded-full">
                        <Lock className="w-3 h-3" />
                        Locked
                      </span>
                    )}
                  </div>

                  <h4 className="font-heading font-bold text-base text-[#1F2937]">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">
                    {ach.description}
                  </p>
                </div>

                {/* Progress bar or Unlocked Date */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  {isUnlocked ? (
                    <div className="flex items-center justify-between text-xs text-[#6D28D9] font-black">
                      <span>Reward Claimed</span>
                      <span>+{ach.xpReward} XP</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-gray-600 mb-1">
                        <span className="uppercase text-[10px] text-gray-400 font-black">Progress</span>
                        <span>{progress} / {ach.maxProgress}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#8B5CF6] rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. REWARDS & PERKS STORE */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#1F2937] flex items-center gap-2">
              <Gift className="w-6 h-6 text-[#8B5CF6]" />
              Rewards & Study Perks Shop
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Spend lifetime XP to unlock aesthetic themes, streak protection shields, and boosters
            </p>
          </div>

          <div className="px-4 py-2 bg-purple-50 border border-purple-200 rounded-2xl text-xs font-black text-[#6D28D9]">
            Available XP: {stats.totalXP}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {rewards.map((reward) => {
            const Icon = getRewardIcon(reward.icon);
            const isUnlocked = reward.unlocked;
            const canAfford = stats.totalXP >= reward.costXP;

            return (
              <div
                key={reward.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>

                    <span
                      className={`text-xs font-heading font-black px-3.5 py-1 rounded-full ${
                        isUnlocked
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : canAfford
                          ? 'bg-purple-100 text-[#6D28D9]'
                          : 'bg-[#F3F4F6] text-gray-500'
                      }`}
                    >
                      {reward.costXP === 0 ? 'Free' : `${reward.costXP} XP`}
                    </span>
                  </div>

                  <h4 className="font-heading font-bold text-base text-[#1F2937]">
                    {reward.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed font-medium">
                    {reward.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100">
                  {isUnlocked ? (
                    <button
                      disabled
                      className="w-full py-3 px-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-default min-h-[44px]"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Unlocked & Active</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => redeemReward(reward.id)}
                      disabled={!canAfford}
                      className={`w-full py-3 px-4 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                        canAfford
                          ? 'bg-[#8B5CF6] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-200 active:scale-95'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{canAfford ? 'Unlock Reward' : `Need ${reward.costXP - stats.totalXP} more XP`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
