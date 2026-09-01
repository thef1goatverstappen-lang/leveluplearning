export type Priority = 'Low' | 'Medium' | 'High';

export type Subject = 
  | 'Mathematics'
  | 'Science'
  | 'English'
  | 'Social Studies'
  | 'History'
  | 'Computer Science'
  | 'Languages'
  | 'Visual Arts'
  | 'Physical Education'
  | 'Other';

export interface Task {
  id: string;
  title: string;
  subject: Subject;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  completedAt?: string; // ISO string
  xpAwarded: boolean;
  xpValue: number; // Low: 10, Medium: 20, High: 30
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  subject?: Subject;
  durationMinutes: number;
  completedAt: string; // ISO string
  xpAwarded: number;
  type: 'focus' | 'shortBreak' | 'longBreak';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
  category: 'tasks' | 'streaks' | 'focus' | 'special';
  xpReward: number;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  costXP: number;
  icon: string;
  unlocked: boolean;
  category: 'theme' | 'perk' | 'badge' | 'mystery';
  type: 'theme_accent' | 'xp_boost' | 'streak_freeze' | 'mystery_box';
  data?: any;
}

export interface XPLogEntry {
  id: string;
  amount: number;
  reason: string;
  timestamp: string;
  type: 'task' | 'focus' | 'achievement' | 'bonus';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  grade: 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';
  avatar: string;
  motto: string;
  dailyGoalTarget: number; // e.g. 4 tasks
  subjects: Subject[];
  themeColor: 'purple' | 'blue' | 'emerald' | 'amber' | 'rose';
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  streakFreezeTokens: number;
  activeXpBoost: boolean;
  xpBoostMultiplier: number;
}

export interface UserStats {
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  totalTasksCompleted: number;
  totalFocusMinutes: number;
  totalFocusSessions: number;
}

export type NavigationTab = 
  | 'dashboard'
  | 'tasks'
  | 'calendar'
  | 'focus'
  | 'progress'
  | 'rewards'
  | 'profile';
