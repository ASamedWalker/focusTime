// src/types/timer.ts
export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export interface TimerConfig {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

// src/hooks/useTimer.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import * as Haptics from 'expo-haptics';

const DEFAULT_CONFIG: TimerConfig = {
  focusDuration: 25 * 60, // 25 minutes
  shortBreakDuration: 5 * 60, // 5 minutes
  longBreakDuration: 15 * 60, // 15 minutes
  sessionsUntilLongBreak: 4
};

export const useTimer = (config: TimerConfig = DEFAULT_CONFIG) => {
  const [state, setState] = useState({
    timeRemaining: config.focusDuration,
    mode: 'focus' as TimerMode,
    isActive: false,
    isPaused: false,
    completedSessions: 0
  });

  const intervalRef = useRef<ReturnType<typeof setInterval>>();
  const backgroundTimeRef = useRef<number>();

  const getDuration = useCallback((mode: TimerMode) => {
    switch (mode) {
      case 'focus':
        return config.focusDuration;
      case 'shortBreak':
        return config.shortBreakDuration;
      case 'longBreak':
        return config.longBreakDuration;
    }
  }, [config]);

  const getNextMode = useCallback((): TimerMode => {
    if (state.mode === 'focus') {
      return (state.completedSessions + 1) % config.sessionsUntilLongBreak === 0
        ? 'longBreak'
        : 'shortBreak';
    }
    return 'focus';
  }, [state.mode, state.completedSessions, config]);

  const switchMode = useCallback((mode: TimerMode) => {
    setState(prev => ({
      ...prev,
      mode,
      timeRemaining: getDuration(mode),
      isActive: false,
      isPaused: false
    }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [getDuration]);

  const startTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setState(prev => ({ ...prev, isActive: true, isPaused: false }));

    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(intervalRef.current);
          const nextMode = getNextMode();
          return {
            ...prev,
            mode: nextMode,
            timeRemaining: getDuration(nextMode),
            isActive: false,
            completedSessions: prev.mode === 'focus'
              ? prev.completedSessions + 1
              : prev.completedSessions
          };
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
  }, [getNextMode, getDuration]);

  const pauseTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({ ...prev, isActive: false, isPaused: true }));
  }, []);

  const resetTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setState(prev => ({
      ...prev,
      timeRemaining: getDuration(prev.mode),
      isActive: false,
      isPaused: false
    }));
  }, [getDuration]);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && backgroundTimeRef.current && state.isActive) {
        const now = Date.now();
        const timeInBackground = now - backgroundTimeRef.current;
        const newTimeRemaining = Math.max(
          0,
          state.timeRemaining - Math.floor(timeInBackground / 1000)
        );
        setState(prev => ({ ...prev, timeRemaining: newTimeRemaining }));
      } else if (nextAppState === 'background' && state.isActive) {
        backgroundTimeRef.current = Date.now();
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    });

    return () => {
      subscription.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, state.timeRemaining]);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    progress: state.timeRemaining / getDuration(state.mode)
  };
};