import {
  Achievement,
  FocusSession,
  Priority,
  RewardItem,
  Subject,
  Task,
  UserProfile,
  UserStats,
  XPLogEntry,
} from '../types';

const STORAGE_KEYS = {
  PROFILE: 'lvlup_user_profile',
  STATS: 'lvlup_user_stats',
  TASKS: 'lvlup_tasks',
  FOCUS_SESSIONS: 'lvlup_focus_sessions',
  ACHIEVEMENTS: 'lvlup_achievements',
  REWARDS: 'lvlup_rewards',
  XP_LOGS: 'lvlup_xp_logs',
  AUTH: 'lvlup_auth_session',
};

export const SUBJECT_COLORS: Record<Subject, { bg: string; text: string; border: string; badge: string; hex: string }> = {
  Mathematics: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', badge: 'bg-blue-600', hex: '#2563EB' },
  Science: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', badge: 'bg-emerald-600', hex: '#059669' },
  English: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', badge: 'bg-amber-600', hex: '#D97706' },
  'Social Studies': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', badge: 'bg-orange-600', hex: '#EA580C' },
  History: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', badge: 'bg-rose-600', hex: '#E11D48' },
  'Computer Science': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', badge: 'bg-purple-600', hex: '#8B5CF6' },
  Languages: { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', badge: 'bg-teal-600', hex: '#0D9488' },
  'Visual Arts': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', badge: 'bg-pink-600', hex: '#DB2777' },
  'Physical Education': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', badge: 'bg-lime-600', hex: '#65A30D' },
  Other: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', badge: 'bg-slate-600', hex: '#64748B' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; xp: number; bg: string; text: string; border: string; dot: string }> = {
  Low: { label: 'Low', xp: 10, bg: 'bg-emerald-50 text-emerald-700', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Medium: { label: 'Medium', xp: 20, bg: 'bg-amber-50 text-amber-700', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
  High: { label: 'High', xp: 30, bg: 'bg-rose-50 text-rose-700', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-500' },
};

export const LEVEL_TITLES: { [level: number]: string } = {
  1: 'Novice Scholar',
  2: 'Apprentice Learner',
  3: 'Study Ace',
  4: 'Homework Hero',
  5: 'Task Master',
  6: 'Academic Warrior',
  7: 'Knowledge Knight',
  8: 'Honor Roll Master',
  9: 'Valedictorian in Training',
  10: 'Legendary Scholar',
};

export function getLevelTitle(level: number): string {
  return LEVEL_TITLES[level] || `Grandmaster Scholar Lv.${level}`;
}

// Helpers for formatted dates
export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getDateOffset(offsetDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'user_alex_10th',
  name: 'Alex Rivera',
  email: 'alex.rivera@highschool.edu',
  grade: 'Grade 10',
  avatar: '🚀',
  motto: 'Striving for excellence one assignment at a time!',
  dailyGoalTarget: 4,
  subjects: ['Mathematics', 'Science', 'English', 'History', 'Computer Science', 'Visual Arts'],
  themeColor: 'purple',
  soundEnabled: true,
  notificationsEnabled: true,
  streakFreezeTokens: 1,
  activeXpBoost: false,
  xpBoostMultiplier: 1.5,
};

const DEFAULT_STATS: UserStats = {
  totalXP: 6750, // Level 7 (6000 XP base + 750 / 1000)
  level: 7,
  currentStreak: 5,
  longestStreak: 8,
  lastActiveDate: getTodayDateString(),
  totalTasksCompleted: 12,
  totalFocusMinutes: 175,
  totalFocusSessions: 7,
};

const DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Quadratic Equations Problem Set #4',
    subject: 'Mathematics',
    description: 'Solve problems 1-15 on Chapter 4.3 (factoring & quadratic formula). Show all working steps.',
    dueDate: getTodayDateString(),
    priority: 'High',
    completed: false,
    xpAwarded: false,
    xpValue: 30,
  },
  {
    id: 'task-2',
    title: 'Cellular Respiration Lab Analysis',
    subject: 'Science',
    description: 'Write up the conclusion and create graph comparing yeast respiration rates at 3 temperatures.',
    dueDate: getDateOffset(1),
    priority: 'High',
    completed: false,
    xpAwarded: false,
    xpValue: 30,
  },
  {
    id: 'task-3',
    title: 'Macbeth Act III Soliloquy Response',
    subject: 'English',
    description: 'Write a 400-word reflective response analyzing Macbeth’s guilt and psychological spiral.',
    dueDate: getDateOffset(2),
    priority: 'Medium',
    completed: false,
    xpAwarded: false,
    xpValue: 20,
  },
  {
    id: 'task-4',
    title: 'WWII Pacific Theater Timeline Draft',
    subject: 'History',
    description: 'Assemble key battle dates and brief summaries for the history group poster project.',
    dueDate: getDateOffset(3),
    priority: 'Medium',
    completed: false,
    xpAwarded: false,
    xpValue: 20,
  },
  {
    id: 'task-5',
    title: 'Python Array & Loop Exercises',
    subject: 'Computer Science',
    description: 'Implement binary search and bubble sort visualization in Python Jupyter notebook.',
    dueDate: getDateOffset(4),
    priority: 'Low',
    completed: false,
    xpAwarded: false,
    xpValue: 10,
  },
  {
    id: 'task-6',
    title: 'Perspective Drawing Study',
    subject: 'Visual Arts',
    description: '2-point perspective drawing of the school courtyard using ink and graphite pencils.',
    dueDate: getDateOffset(5),
    priority: 'Low',
    completed: false,
    xpAwarded: false,
    xpValue: 10,
  },
  {
    id: 'task-7',
    title: 'Biology Chapter 5 Vocabulary Flashcards',
    subject: 'Science',
    description: 'Review ATP, Glycolysis, and Krebs cycle key terms for upcoming quiz.',
    dueDate: getTodayDateString(),
    priority: 'Medium',
    completed: true,
    completedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    xpAwarded: true,
    xpValue: 20,
  },
  {
    id: 'task-8',
    title: 'Geometry Theorem Proofs Review',
    subject: 'Mathematics',
    description: 'Circle theorems and angle subtended by an arc review worksheet.',
    dueDate: getDateOffset(-1),
    priority: 'High',
    completed: true,
    completedAt: new Date(Date.now() - 86400000).toISOString(),
    xpAwarded: true,
    xpValue: 30,
  },
];

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your very first task and begin your learning journey.',
    icon: 'Target',
    unlocked: true,
    progress: 1,
    maxProgress: 1,
    unlockedAt: '2026-08-25',
    category: 'tasks',
    xpReward: 50,
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 10 homework assignments or study tasks.',
    icon: 'CheckCircle2',
    unlocked: true,
    progress: 12,
    maxProgress: 10,
    unlockedAt: '2026-08-30',
    category: 'tasks',
    xpReward: 100,
  },
  {
    id: 'study-warrior',
    title: 'Study Warrior',
    description: 'Complete 10 Pomodoro focus sessions in the Focus Zone.',
    icon: 'Zap',
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    category: 'focus',
    xpReward: 150,
  },
  {
    id: 'deadline-destroyer',
    title: 'Deadline Destroyer',
    description: 'Complete 5 tasks before their scheduled deadline date.',
    icon: 'Flame',
    unlocked: true,
    progress: 5,
    maxProgress: 5,
    unlockedAt: '2026-08-29',
    category: 'tasks',
    xpReward: 120,
  },
  {
    id: 'consistency-king',
    title: 'Consistency King',
    description: 'Maintain a 7-day continuous study streak.',
    icon: 'Crown',
    unlocked: false,
    progress: 5,
    maxProgress: 7,
    category: 'streaks',
    xpReward: 200,
  },
  {
    id: 'night-owl',
    title: 'Focus Champion',
    description: 'Log over 150 total minutes of deep study time.',
    icon: 'Clock',
    unlocked: true,
    progress: 175,
    maxProgress: 150,
    unlockedAt: '2026-08-30',
    category: 'focus',
    xpReward: 100,
  },
  {
    id: 'subject-scholar',
    title: 'STEM Ace',
    description: 'Complete 5 Science or Math assignments with high priority.',
    icon: 'Award',
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    category: 'special',
    xpReward: 150,
  },
  {
    id: 'century-club',
    title: 'Century Club',
    description: 'Accumulate over 10,000 total lifetime XP.',
    icon: 'Trophy',
    unlocked: false,
    progress: 6750,
    maxProgress: 10000,
    category: 'special',
    xpReward: 500,
  },
];

const DEFAULT_REWARDS: RewardItem[] = [
  {
    id: 'reward-theme-purple',
    title: 'Nebula Violet Theme',
    description: 'Unlock a glowing deep cosmic purple UI theme accent.',
    costXP: 0,
    icon: 'Palette',
    unlocked: true,
    category: 'theme',
    type: 'theme_accent',
    data: { theme: 'purple' },
  },
  {
    id: 'reward-theme-emerald',
    title: 'Emerald Scholar Theme',
    description: 'A vibrant emerald green interface for fresh focus.',
    costXP: 300,
    icon: 'Sparkles',
    unlocked: true,
    category: 'theme',
    type: 'theme_accent',
    data: { theme: 'emerald' },
  },
  {
    id: 'reward-xp-boost',
    title: '24hr XP Booster (1.5x)',
    description: 'Earn 50% bonus XP on all tasks and focus sessions for the next 24 hours.',
    costXP: 450,
    icon: 'Rocket',
    unlocked: false,
    category: 'perk',
    type: 'xp_boost',
  },
  {
    id: 'reward-streak-freeze',
    title: 'Streak Freeze Shield',
    description: 'Protects your streak for 1 day if you miss a study session during busy weekends or exams.',
    costXP: 350,
    icon: 'Shield',
    unlocked: true,
    category: 'perk',
    type: 'streak_freeze',
  },
  {
    id: 'reward-mystery-box',
    title: 'Mystery Loot Crate',
    description: 'Unlock a surprise bonus badge, special avatar, and instant XP reward!',
    costXP: 600,
    icon: 'Gift',
    unlocked: false,
    category: 'mystery',
    type: 'mystery_box',
  },
  {
    id: 'reward-theme-amber',
    title: 'Sunset Amber Theme',
    description: 'Warm golden hour study aesthetic with sunset orange accents.',
    costXP: 500,
    icon: 'Sun',
    unlocked: false,
    category: 'theme',
    type: 'theme_accent',
    data: { theme: 'amber' },
  },
];

const DEFAULT_XP_LOGS: XPLogEntry[] = [
  { id: 'xp-1', amount: 30, reason: 'High Priority: Geometry Proofs', timestamp: getDateOffset(-1), type: 'task' },
  { id: 'xp-2', amount: 25, reason: 'Focus Zone Session (25 min)', timestamp: getDateOffset(-1), type: 'focus' },
  { id: 'xp-3', amount: 20, reason: 'Medium Priority: Biology Flashcards', timestamp: getTodayDateString(), type: 'task' },
  { id: 'xp-4', amount: 25, reason: 'Focus Zone Session (25 min)', timestamp: getTodayDateString(), type: 'focus' },
  { id: 'xp-5', amount: 100, reason: 'Achievement Unlocked: Focus Champion', timestamp: getDateOffset(-1), type: 'achievement' },
];

export class StorageService {
  // Authentication Mock / State
  static isAuthenticated(): boolean {
    const session = localStorage.getItem(STORAGE_KEYS.AUTH);
    return session ? JSON.parse(session).loggedIn : true; // default logged in for preview
  }

  static setAuthSession(loggedIn: boolean, email?: string, name?: string) {
    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ loggedIn, email: email || 'alex.rivera@highschool.edu', name: name || 'Alex Rivera' })
    );
  }

  // Profile
  static getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  static saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // Stats & XP
  static getStats(): UserStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      if (!data) return DEFAULT_STATS;
      const stats: UserStats = JSON.parse(data);
      // Re-evaluate streak relative to today
      const today = getTodayDateString();
      if (stats.lastActiveDate !== today) {
        const lastDate = new Date(stats.lastActiveDate);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) {
          // Missed more than 1 day
          const profile = this.getProfile();
          if (profile.streakFreezeTokens > 0) {
            // Auto consume streak freeze
            profile.streakFreezeTokens -= 1;
            this.saveProfile(profile);
          } else {
            stats.currentStreak = 0;
          }
        }
      }
      return stats;
    } catch {
      return DEFAULT_STATS;
    }
  }

  static saveStats(stats: UserStats): void {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }

  // Tasks
  static getTasks(): Task[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      return data ? JSON.parse(data) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  }

  static saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  // Focus Sessions
  static getFocusSessions(): FocusSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveFocusSessions(sessions: FocusSession[]): void {
    localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(sessions));
  }

  // Achievements
  static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : DEFAULT_ACHIEVEMENTS;
    } catch {
      return DEFAULT_ACHIEVEMENTS;
    }
  }

  static saveAchievements(achievements: Achievement[]): void {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  // Rewards
  static getRewards(): RewardItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REWARDS);
      return data ? JSON.parse(data) : DEFAULT_REWARDS;
    } catch {
      return DEFAULT_REWARDS;
    }
  }

  static saveRewards(rewards: RewardItem[]): void {
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(rewards));
  }

  // XP Logs
  static getXPLogs(): XPLogEntry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.XP_LOGS);
      return data ? JSON.parse(data) : DEFAULT_XP_LOGS;
    } catch {
      return DEFAULT_XP_LOGS;
    }
  }

  static saveXPLogs(logs: XPLogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.XP_LOGS, JSON.stringify(logs));
  }

  // XP Addition Engine & Level Up Check
  static addXP(
    amount: number,
    reason: string,
    type: 'task' | 'focus' | 'achievement' | 'bonus'
  ): {
    oldLevel: number;
    newLevel: number;
    didLevelUp: boolean;
    earnedXP: number;
    newTotalXP: number;
    currentLevelXP: number;
  } {
    const profile = this.getProfile();
    const stats = this.getStats();

    const actualAmount = profile.activeXpBoost ? Math.round(amount * (profile.xpBoostMultiplier || 1.5)) : amount;
    const oldLevel = Math.floor(stats.totalXP / 1000) + 1;
    const newTotalXP = stats.totalXP + actualAmount;
    const newLevel = Math.floor(newTotalXP / 1000) + 1;
    const didLevelUp = newLevel > oldLevel;

    // Update stats
    stats.totalXP = newTotalXP;
    stats.level = newLevel;

    // Streak update logic
    const today = getTodayDateString();
    if (stats.lastActiveDate !== today) {
      stats.currentStreak = (stats.currentStreak || 0) + 1;
      if (stats.currentStreak > (stats.longestStreak || 0)) {
        stats.longestStreak = stats.currentStreak;
      }
      stats.lastActiveDate = today;
    }

    this.saveStats(stats);

    // Add XP log
    const logs = this.getXPLogs();
    logs.unshift({
      id: `xp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      amount: actualAmount,
      reason,
      timestamp: new Date().toISOString(),
      type,
    });
    this.saveXPLogs(logs.slice(0, 50)); // keep last 50

    // Evaluate Achievements
    this.checkAndUnlockAchievements(stats);

    return {
      oldLevel,
      newLevel,
      didLevelUp,
      earnedXP: actualAmount,
      newTotalXP,
      currentLevelXP: newTotalXP % 1000,
    };
  }

  // Achievement Evaluator
  static checkAndUnlockAchievements(stats: UserStats): Achievement[] {
    const achievements = this.getAchievements();
    const tasks = this.getTasks();
    const completedTasks = tasks.filter((t) => t.completed).length;
    let newlyUnlocked: Achievement[] = [];

    achievements.forEach((ach) => {
      if (ach.unlocked) return;

      if (ach.id === 'first-step') {
        ach.progress = completedTasks;
        if (completedTasks >= 1) {
          ach.unlocked = true;
          ach.unlockedAt = getTodayDateString();
          newlyUnlocked.push(ach);
        }
      } else if (ach.id === 'task-master') {
        ach.progress = completedTasks;
        if (completedTasks >= 10) {
          ach.unlocked = true;
          ach.unlockedAt = getTodayDateString();
          newlyUnlocked.push(ach);
        }
      } else if (ach.id === 'study-warrior') {
        ach.progress = stats.totalFocusSessions || 0;
        if (stats.totalFocusSessions >= 10) {
          ach.unlocked = true;
          ach.unlockedAt = getTodayDateString();
          newlyUnlocked.push(ach);
        }
      } else if (ach.id === 'consistency-king') {
        ach.progress = stats.currentStreak;
        if (stats.currentStreak >= 7) {
          ach.unlocked = true;
          ach.unlockedAt = getTodayDateString();
          newlyUnlocked.push(ach);
        }
      } else if (ach.id === 'night-owl') {
        ach.progress = stats.totalFocusMinutes;
        if (stats.totalFocusMinutes >= 150) {
          ach.unlocked = true;
          ach.unlockedAt = getTodayDateString();
          newlyUnlocked.push(ach);
        }
      } else if (ach.id === 'century-club') {
        ach.progress = stats.totalXP;
        if (stats.totalXP >= 10000) {
          ach.unlocked = true;
          ach.unlockedAt = getTodayDateString();
          newlyUnlocked.push(ach);
        }
      }
    });

    this.saveAchievements(achievements);
    return newlyUnlocked;
  }

  // Reset to default data (useful for demonstration)
  static resetToDefault(): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(DEFAULT_STATS));
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(DEFAULT_ACHIEVEMENTS));
    localStorage.setItem(STORAGE_KEYS.REWARDS, JSON.stringify(DEFAULT_REWARDS));
    localStorage.setItem(STORAGE_KEYS.XP_LOGS, JSON.stringify(DEFAULT_XP_LOGS));
  }
}
