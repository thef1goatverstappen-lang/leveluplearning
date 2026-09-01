import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Achievement,
  FocusSession,
  NavigationTab,
  RewardItem,
  Task,
  UserProfile,
  UserStats,
  XPLogEntry,
} from '../types';
import { getLevelTitle, StorageService } from '../services/storage';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';

interface ToastItem {
  id: string;
  message: string;
  xp?: number;
  type?: 'success' | 'level' | 'info' | 'streak';
}

interface LevelUpInfo {
  isOpen: boolean;
  level: number;
  title: string;
  rewardsUnlocked?: string[];
}

interface AppContextType {
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  userProfile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  stats: UserStats;
  tasks: Task[];
  focusSessions: FocusSession[];
  achievements: Achievement[];
  rewards: RewardItem[];
  xpLogs: XPLogEntry[];
  toasts: ToastItem[];
  levelUpModal: LevelUpInfo;
  closeLevelUpModal: () => void;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string, grade: 'Grade 9' | 'Grade 10') => void;
  logout: () => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'xpAwarded' | 'xpValue'>) => void;
  editTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleCompleteTask: (taskId: string) => void;
  completeFocusSession: (durationMinutes: number, taskId?: string, taskTitle?: string) => void;
  redeemReward: (rewardId: string) => { success: boolean; message: string };
  resetAllData: () => void;
  activeFocusTaskId: string | null;
  setActiveFocusTaskId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile>(StorageService.getProfile());
  const [stats, setStats] = useState<UserStats>(StorageService.getStats());
  const [tasks, setTasks] = useState<Task[]>(StorageService.getTasks());
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(StorageService.getFocusSessions());
  const [achievements, setAchievements] = useState<Achievement[]>(StorageService.getAchievements());
  const [rewards, setRewards] = useState<RewardItem[]>(StorageService.getRewards());
  const [xpLogs, setXpLogs] = useState<XPLogEntry[]>(StorageService.getXPLogs());
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [activeFocusTaskId, setActiveFocusTaskId] = useState<string | null>(null);

  const [levelUpModal, setLevelUpModal] = useState<LevelUpInfo>({
    isOpen: false,
    level: 1,
    title: '',
  });

  // Sync state on load
  useEffect(() => {
    setIsAuthenticated(StorageService.isAuthenticated());
  }, []);

  const addToast = (message: string, xp?: number, type: 'success' | 'level' | 'info' | 'streak' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, xp, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#6D28D9', '#10B981', '#F59E0B', '#3B82F6'],
      });
    } catch (e) {
      // ignore
    }
  };

  const triggerGrandConfetti = () => {
    try {
      const end = Date.now() + 2.5 * 1000;
      const colors = ['#8B5CF6', '#10B981', '#F59E0B', '#EC4899', '#3B82F6'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    } catch (e) {
      // ignore
    }
  };

  const login = (email: string, name?: string) => {
    StorageService.setAuthSession(true, email, name);
    if (name) {
      const updated = { ...userProfile, name, email };
      setUserProfile(updated);
      StorageService.saveProfile(updated);
    }
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
    addToast(`Welcome back, ${name || userProfile.name}! 👋`, undefined, 'info');
  };

  const signup = (name: string, email: string, grade: 'Grade 9' | 'Grade 10') => {
    const updated: UserProfile = {
      ...userProfile,
      name,
      email,
      grade,
    };
    setUserProfile(updated);
    StorageService.saveProfile(updated);
    StorageService.setAuthSession(true, email, name);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
    addToast(`Account created! Welcome to Level Up Learning, ${name}! 🎉`, undefined, 'success');
  };

  const logout = () => {
    StorageService.setAuthSession(false);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...userProfile, ...updates };
    setUserProfile(updated);
    StorageService.saveProfile(updated);
    addToast('Profile preferences updated!', undefined, 'info');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'completed' | 'xpAwarded' | 'xpValue'>) => {
    let xpValue = 10;
    if (taskData.priority === 'Medium') xpValue = 20;
    if (taskData.priority === 'High') xpValue = 30;

    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
      xpAwarded: false,
      xpValue,
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    StorageService.saveTasks(updated);
    addToast(`Task "${newTask.title}" created (+${newTask.xpValue} XP potential)`, undefined, 'info');
  };

  const editTask = (updatedTask: Task) => {
    let xpValue = 10;
    if (updatedTask.priority === 'Medium') xpValue = 20;
    if (updatedTask.priority === 'High') xpValue = 30;
    const taskWithXp = { ...updatedTask, xpValue };

    const updated = tasks.map((t) => (t.id === taskWithXp.id ? taskWithXp : t));
    setTasks(updated);
    StorageService.saveTasks(updated);
    addToast(`Task "${taskWithXp.title}" updated`, undefined, 'info');
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    StorageService.saveTasks(updated);
    if (taskToDelete) {
      addToast(`Task deleted: ${taskToDelete.title}`, undefined, 'info');
    }
  };

  const toggleCompleteTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const isNowCompleted = !task.completed;
    const willAwardXP = isNowCompleted && !task.xpAwarded;

    const updatedTask: Task = {
      ...task,
      completed: isNowCompleted,
      completedAt: isNowCompleted ? new Date().toISOString() : undefined,
      xpAwarded: task.xpAwarded || willAwardXP,
    };

    const updatedTasks = tasks.map((t) => (t.id === taskId ? updatedTask : t));
    setTasks(updatedTasks);
    StorageService.saveTasks(updatedTasks);

    if (willAwardXP) {
      // Award XP
      const xpEarned = task.xpValue || (task.priority === 'High' ? 30 : task.priority === 'Medium' ? 20 : 10);
      const result = StorageService.addXP(
        xpEarned,
        `Completed Task: ${task.title} (${task.priority} Priority)`,
        'task'
      );

      // Play audio chime if enabled
      if (userProfile.soundEnabled) {
        soundManager.playXpGain();
      }

      // Update fresh stats and achievements from storage
      setStats(StorageService.getStats());
      setAchievements(StorageService.getAchievements());
      setXpLogs(StorageService.getXPLogs());

      // Trigger Confetti & Toast
      triggerConfetti();
      addToast(`Awesome job! Completed "${task.title}"`, result.earnedXP, 'success');

      // Check level up
      if (result.didLevelUp) {
        if (userProfile.soundEnabled) {
          setTimeout(() => soundManager.playLevelUp(), 300);
        }
        triggerGrandConfetti();
        setLevelUpModal({
          isOpen: true,
          level: result.newLevel,
          title: getLevelTitle(result.newLevel),
        });
      }
    } else if (isNowCompleted) {
      addToast(`Marked "${task.title}" as complete (XP already awarded)`, undefined, 'info');
    } else {
      addToast(`Moved "${task.title}" back to active tasks`, undefined, 'info');
    }
  };

  const completeFocusSession = (durationMinutes: number, taskId?: string, taskTitle?: string) => {
    const xpBase = 25; // 25 XP for completing focus session
    const result = StorageService.addXP(
      xpBase,
      `Completed ${durationMinutes}m Focus Session${taskTitle ? `: ${taskTitle}` : ''}`,
      'focus'
    );

    const newSession: FocusSession = {
      id: `session-${Date.now()}`,
      durationMinutes,
      taskId,
      taskTitle,
      completedAt: new Date().toISOString(),
      xpAwarded: result.earnedXP,
      type: 'focus',
    };

    const updatedSessions = [newSession, ...focusSessions];
    setFocusSessions(updatedSessions);
    StorageService.saveFocusSessions(updatedSessions);

    // Update stats
    const currentStats = StorageService.getStats();
    currentStats.totalFocusMinutes += durationMinutes;
    currentStats.totalFocusSessions += 1;
    StorageService.saveStats(currentStats);

    setStats(StorageService.getStats());
    setAchievements(StorageService.getAchievements());
    setXpLogs(StorageService.getXPLogs());

    if (userProfile.soundEnabled) {
      soundManager.playTimerBell();
    }
    triggerConfetti();
    addToast(`Focus session completed! Great concentration!`, result.earnedXP, 'success');

    if (result.didLevelUp) {
      if (userProfile.soundEnabled) {
        setTimeout(() => soundManager.playLevelUp(), 400);
      }
      triggerGrandConfetti();
      setLevelUpModal({
        isOpen: true,
        level: result.newLevel,
        title: getLevelTitle(result.newLevel),
      });
    }
  };

  const redeemReward = (rewardId: string): { success: boolean; message: string } => {
    const reward = rewards.find((r) => r.id === rewardId);
    if (!reward) return { success: false, message: 'Reward not found' };
    if (reward.unlocked) return { success: false, message: 'Reward is already unlocked' };

    if (stats.totalXP < reward.costXP) {
      return {
        success: false,
        message: `Need ${reward.costXP - stats.totalXP} more XP to unlock this reward!`,
      };
    }

    const updatedRewards = rewards.map((r) => (r.id === rewardId ? { ...r, unlocked: true } : r));
    setRewards(updatedRewards);
    StorageService.saveRewards(updatedRewards);

    // Apply reward effect if theme or perk
    if (reward.type === 'theme_accent' && reward.data?.theme) {
      updateProfile({ themeColor: reward.data.theme });
    } else if (reward.type === 'streak_freeze') {
      updateProfile({ streakFreezeTokens: userProfile.streakFreezeTokens + 1 });
    } else if (reward.type === 'xp_boost') {
      updateProfile({ activeXpBoost: true, xpBoostMultiplier: 1.5 });
    }

    if (userProfile.soundEnabled) {
      soundManager.playLevelUp();
    }
    triggerConfetti();
    addToast(`Unlocked reward: ${reward.title}! 🎁`, undefined, 'success');
    return { success: true, message: `Unlocked ${reward.title} successfully!` };
  };

  const resetAllData = () => {
    StorageService.resetToDefault();
    setUserProfile(StorageService.getProfile());
    setStats(StorageService.getStats());
    setTasks(StorageService.getTasks());
    setFocusSessions(StorageService.getFocusSessions());
    setAchievements(StorageService.getAchievements());
    setRewards(StorageService.getRewards());
    setXpLogs(StorageService.getXPLogs());
    addToast('All data has been reset to default Grade 10 demo state', undefined, 'info');
  };

  const closeLevelUpModal = () => {
    setLevelUpModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        userProfile,
        updateProfile,
        stats,
        tasks,
        focusSessions,
        achievements,
        rewards,
        xpLogs,
        toasts,
        levelUpModal,
        closeLevelUpModal,
        isAuthenticated,
        login,
        signup,
        logout,
        addTask,
        editTask,
        deleteTask,
        toggleCompleteTask,
        completeFocusSession,
        redeemReward,
        resetAllData,
        activeFocusTaskId,
        setActiveFocusTaskId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
