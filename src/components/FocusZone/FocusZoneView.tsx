import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { soundManager } from '../../utils/audio';
import { SUBJECT_COLORS, PRIORITY_CONFIG } from '../../services/storage';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Sparkles,
  CheckCircle2,
  Clock,
  BookOpen,
  CloudRain,
  Radio,
  Flame,
  Zap,
} from 'lucide-react';

export const FocusZoneView: React.FC = () => {
  const {
    tasks,
    activeFocusTaskId,
    setActiveFocusTaskId,
    completeFocusSession,
    userProfile,
    stats,
  } = useApp();

  // Timer modes & durations in minutes
  const [sessionType, setSessionType] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [customMinutes, setCustomMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(25 * 60);
  const [completedSessionsCount, setCompletedSessionsCount] = useState<number>(stats.totalFocusSessions || 0);
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'whitenoise' | 'lofi'>('off');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Selected task
  const activeTask = tasks.find((t) => t.id === activeFocusTaskId);
  const pendingTasks = tasks.filter((t) => !t.completed);

  // Switch presets
  const handleSetPreset = (type: 'focus' | 'shortBreak' | 'longBreak', minutes: number) => {
    setIsRunning(false);
    setSessionType(type);
    setCustomMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setTotalSessionSeconds(minutes * 60);
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsRemaining === 0) {
      setIsRunning(false);
      if (sessionType === 'focus') {
        completeFocusSession(
          customMinutes,
          activeTask?.id,
          activeTask?.title || 'General Deep Focus'
        );
        setCompletedSessionsCount((prev) => prev + 1);
        // Prompt break
        handleSetPreset('shortBreak', 5);
      } else {
        handleSetPreset('focus', 25);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, sessionType, customMinutes, activeTask]);

  // Ambient sound handler
  const handleToggleAmbient = (type: 'off' | 'rain' | 'whitenoise' | 'lofi') => {
    if (ambientSound === type || type === 'off') {
      soundManager.stopAmbient();
      setAmbientSound('off');
    } else {
      soundManager.startAmbient(type);
      setAmbientSound(type);
    }
  };

  // Stop ambient sound on unmount
  useEffect(() => {
    return () => {
      soundManager.stopAmbient();
    };
  }, []);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = totalSessionSeconds > 0
    ? Math.min(100, Math.max(0, ((totalSessionSeconds - secondsRemaining) / totalSessionSeconds) * 100))
    : 0;

  // SVG Circular progress math
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div
      className={`space-y-6 max-w-5xl mx-auto pb-10 transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 bg-gray-950 p-6 flex flex-col justify-center overflow-y-auto' : ''
      }`}
    >
      {/* Top Header */}
      {!isFullscreen && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#8B5CF6] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-[#1F2937]">
                Focus Zone (Pomodoro)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
              Deep study interval timer: Complete focus blocks to earn <span className="text-[#8B5CF6] font-bold">+25 XP</span> and build mental endurance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-purple-50 border border-purple-200/80 rounded-2xl text-xs font-black uppercase text-[#6D28D9] tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>+25 XP per session</span>
            </div>

            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2.5 rounded-2xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              title="Fullscreen Distraction-Free Mode"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Focus Stage */}
      <div
        className={`rounded-3xl p-6 sm:p-10 border shadow-xl relative overflow-hidden transition-colors ${
          isFullscreen
            ? 'bg-gray-900 border-gray-800 text-white max-w-2xl mx-auto w-full'
            : 'bg-white border-gray-100 shadow-purple-900/5'
        }`}
      >
        {isFullscreen && (
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 p-2.5 rounded-2xl bg-gray-800 text-gray-300 hover:text-white transition-colors"
            title="Exit Fullscreen"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        )}

        {/* Task Selection Bar */}
        <div className="max-w-md mx-auto mb-8 text-center">
          <label className={`block text-xs font-black uppercase tracking-wider mb-2 ${isFullscreen ? 'text-purple-300' : 'text-gray-400'}`}>
            Assigned Assignment
          </label>
          <div className="relative">
            <select
              value={activeFocusTaskId || ''}
              onChange={(e) => setActiveFocusTaskId(e.target.value || null)}
              className={`w-full px-4 py-3 text-xs sm:text-sm font-bold rounded-2xl border transition-all appearance-none cursor-pointer text-center ${
                isFullscreen
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-[#8B5CF6]'
                  : 'bg-[#F3F4F6] border-gray-200 text-[#1F2937] hover:bg-white focus:ring-2 focus:ring-[#8B5CF6]'
              }`}
            >
              <option value="">🎯 General Focused Study (No Task)</option>
              {pendingTasks.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.subject}: {t.title} ({t.priority} Priority)
                </option>
              ))}
            </select>
          </div>
          {activeTask && (
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                (SUBJECT_COLORS[activeTask.subject] || SUBJECT_COLORS.Other).bg
              } ${(SUBJECT_COLORS[activeTask.subject] || SUBJECT_COLORS.Other).text}`}>
                {activeTask.subject}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                PRIORITY_CONFIG[activeTask.priority].bg
              }`}>
                +{activeTask.xpValue} XP on completion
              </span>
            </div>
          )}
        </div>

        {/* Preset Modes Buttons */}
        <div className="flex justify-center gap-2 max-w-sm mx-auto mb-8 bg-[#F3F4F6] p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => handleSetPreset('focus', 25)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              sessionType === 'focus' && customMinutes === 25
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-200'
                : isFullscreen ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            25m Focus
          </button>
          <button
            type="button"
            onClick={() => handleSetPreset('focus', 45)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              sessionType === 'focus' && customMinutes === 45
                ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-200'
                : isFullscreen ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            45m Sprint
          </button>
          <button
            type="button"
            onClick={() => handleSetPreset('shortBreak', 5)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              sessionType === 'shortBreak'
                ? 'bg-[#10B981] text-white shadow-md shadow-emerald-200'
                : isFullscreen ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            5m Break
          </button>
          <button
            type="button"
            onClick={() => handleSetPreset('longBreak', 15)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              sessionType === 'longBreak'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : isFullscreen ? 'text-gray-300 hover:text-white' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            15m Break
          </button>
        </div>

        {/* Circular Progress & Timer */}
        <div className="relative flex items-center justify-center my-6">
          <svg className="w-72 h-72 transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className={isFullscreen ? 'text-gray-800' : 'text-purple-100'}
            />
            {/* Animated progress ring */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                sessionType === 'focus' ? 'text-[#8B5CF6]' : 'text-[#10B981]'
              }`}
            />
          </svg>

          {/* Centered Time readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono font-black text-6xl sm:text-7xl tracking-tighter text-[#1F2937] dark:text-white" style={{ color: isFullscreen ? '#ffffff' : '#1F2937' }}>
              {formatTime(secondsRemaining)}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider mt-2 ${
              sessionType === 'focus' ? 'text-[#8B5CF6]' : 'text-[#10B981]'
            }`}>
              {sessionType === 'focus' ? '🎯 Deep Focus' : '☕ Relax & Recharge'}
            </span>
            <span className={`text-[11px] font-bold mt-1 ${isFullscreen ? 'text-gray-400' : 'text-gray-400'}`}>
              {Math.round(progressPercent)}% elapsed
            </span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(customMinutes * 60);
            }}
            className={`p-3.5 rounded-2xl border transition-all min-w-[48px] min-h-[48px] flex items-center justify-center ${
              isFullscreen
                ? 'border-gray-700 bg-gray-800 text-gray-300 hover:text-white'
                : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-10 py-4 rounded-2xl font-heading font-black text-base sm:text-lg text-white flex items-center gap-3 shadow-xl transition-all hover:scale-105 active:scale-95 min-h-[56px] ${
              isRunning
                ? 'bg-[#F59E0B] hover:bg-amber-600 shadow-amber-200'
                : 'bg-[#8B5CF6] hover:bg-[#6D28D9] shadow-purple-200'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause Timer</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Start Focus</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsRunning(false);
              if (sessionType === 'focus') {
                completeFocusSession(customMinutes, activeTask?.id, activeTask?.title || 'Focus Session');
                handleSetPreset('shortBreak', 5);
              } else {
                handleSetPreset('focus', 25);
              }
            }}
            className={`p-3.5 rounded-2xl border transition-all min-w-[48px] min-h-[48px] flex items-center justify-center ${
              isFullscreen
                ? 'border-gray-700 bg-gray-800 text-gray-300 hover:text-white'
                : 'border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'
            }`}
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient Sound Synthesizer Selector */}
        <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Volume2 className={`w-4 h-4 ${ambientSound !== 'off' ? 'text-[#8B5CF6] animate-pulse' : 'text-gray-400'}`} />
              <span className={`text-xs font-bold ${isFullscreen ? 'text-gray-300' : 'text-[#1F2937]'}`}>
                Ambient Audio:
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleAmbient('off')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  ambientSound === 'off'
                    ? 'bg-gray-200 text-gray-800'
                    : 'bg-[#F3F4F6] text-gray-500 hover:text-gray-700'
                }`}
              >
                Mute
              </button>
              <button
                type="button"
                onClick={() => handleToggleAmbient('rain')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  ambientSound === 'rain'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Soft Rain</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleAmbient('lofi')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  ambientSound === 'lofi'
                    ? 'bg-[#8B5CF6] text-white shadow-xs'
                    : 'bg-purple-50 text-[#6D28D9] hover:bg-purple-100'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Lo-Fi Drone</span>
              </button>
              <button
                type="button"
                onClick={() => handleToggleAmbient('whitenoise')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  ambientSound === 'whitenoise'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>White Noise</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
