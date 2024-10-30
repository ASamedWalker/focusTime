// src/hooks/useTimer.ts
import { useState, useCallback, useRef, useEffect } from 'react';
import { AppState } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useStatistics } from './useStatistics';

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

interface TimerState {
  timeRemaining: number;
  isActive: boolean;
  isPaused: boolean;
  mode: TimerMode;
  rounds: number;
  totalFocusTime: number;
}

export const useTimer = (initialTime: number = 25 * 60) => {
  const [state, setState] = useState<TimerState>({
    timeRemaining: initialTime,
    isActive: false,
    isPaused: false,
    mode: 'focus',
    rounds: 0,
    totalFocusTime: 0,
  });

  const intervalRef = useRef<NodeJS.Timer>();
  const backgroundTimeRef = useRef<number>();

  const { recordSession } = useStatistics();
  const sessionStartTimeRef = useRef<Date>();

  const handleTimerComplete = useCallback(async () => {
    if (sessionStartTimeRef.current) {
      const endTime = new Date();
      await recordSession({
        startTime: sessionStartTimeRef.current,
        endTime,
        duration: Math.floor((endTime.getTime() - sessionStartTimeRef.current.getTime()) / 1000),
        wasCompleted: true,
        mode: state.mode,
      });
    }
    const nextMode = state.mode === 'focus'
      ? (state.rounds % 4 === 3 ? 'longBreak' : 'shortBreak')
      : 'focus';

    const duration = nextMode === 'focus'
      ? initialTime
      : nextMode === 'shortBreak'
        ? 5 * 60
        : 15 * 60;

    // Use haptic feedback instead of sound
    Haptics.notificationAsync(
      Haptics.NotificationFeedbackType.Success
    );

    setState(prev => ({
      ...prev,
      timeRemaining: duration,
      mode: nextMode,
      rounds: prev.mode === 'focus' ? prev.rounds + 1 : prev.rounds,
      isActive: false,
    }));
  }, [state.mode, state.rounds, initialTime]);

  const startTimer = useCallback(() => {
    // Medium impact for starting timer
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    sessionStartTimeRef.current = new Date();
    setState(prev => ({ ...prev, isActive: true, isPaused: false }));
    intervalRef.current = setInterval(() => {
      setState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          handleTimerComplete();
          return prev;
        }
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1,
          totalFocusTime: prev.mode === 'focus'
            ? prev.totalFocusTime + 1
            : prev.totalFocusTime,
        };
      });
    }, 1000);
  }, [handleTimerComplete]);

  const pauseTimer = useCallback(() => {
    if (sessionStartTimeRef.current) {
      const endTime = new Date();
      recordSession({
        startTime: sessionStartTimeRef.current,
        endTime,
        duration: Math.floor((endTime.getTime() - sessionStartTimeRef.current.getTime()) / 1000),
        wasCompleted: false,
        mode: state.mode,
      });
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    // Light impact for pausing
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => ({ ...prev, isActive: false, isPaused: true }));
  }, []);

  const resetTimer = useCallback((newTime?: number) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
    }
    // Light impact for reset
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setState(prev => ({
      ...prev,
      timeRemaining: newTime || initialTime,
      isActive: false,
      isPaused: false,
    }));
  }, [initialTime]);

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
          clearInterval(intervalRef.current as NodeJS.Timeout);
        }
      }
    });

    return () => {
      subscription.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    };
  }, [state.isActive, state.timeRemaining]);

  return {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    progress: state.timeRemaining / (state.mode === 'focus'
      ? initialTime
      : state.mode === 'shortBreak'
        ? 5 * 60
        : 15 * 60
    ),
  };
};