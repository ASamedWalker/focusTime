// src/hooks/useTimer.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import * as Haptics from 'expo-haptics';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

export const useTimer = (initialTime: number = 25 * 60) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout>();
  const backgroundTimeRef = useRef<number>();

  const getModeDuration = (timerMode: TimerMode) => {
    switch (timerMode) {
      case 'focus':
        return 25 * 60;
      case 'shortBreak':
        return 5 * 60;
      case 'longBreak':
        return 15 * 60;
    }
  };

  const startTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(true);
    setIsPaused(false);

    intervalRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setIsActive(false);
          return getModeDuration(mode);
        }
        return prev - 1;
      });
    }, 1000);
  }, [mode]);

  const pauseTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setIsPaused(true);
  }, []);

  const resetTimer = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeRemaining(getModeDuration(mode));
    setIsActive(false);
    setIsPaused(false);
  }, [mode]);

  const switchMode = useCallback((newMode: TimerMode) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setMode(newMode);
    setTimeRemaining(getModeDuration(newMode));
    setIsActive(false);
    setIsPaused(false);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active' && backgroundTimeRef.current && isActive) {
        const now = Date.now();
        const timeInBackground = now - backgroundTimeRef.current;
        setTimeRemaining(prev => Math.max(0, prev - Math.floor(timeInBackground / 1000)));
      } else if (nextAppState === 'background' && isActive) {
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
  }, [isActive]);

  const progress = timeRemaining / getModeDuration(mode);

  return {
    timeRemaining,
    mode,
    isActive,
    isPaused,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode
  };
};