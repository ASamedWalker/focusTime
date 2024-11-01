// src/hooks/useTimer.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { AppState, Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Haptics from "expo-haptics";
import { scheduleNotification, setupNotifications } from "../lib/notifications";
import { useTimerSettings } from "../context/TimerSettingsContext";
import { soundManager } from "../lib/soundManager";
import { updateBackgroundNotification } from "../lib/notifications";
import * as Notifications from 'expo-notifications';

export type TimerMode = "focus" | "shortBreak" | "longBreak";

const TIMER_BACKGROUND_TASK = "TIMER_BACKGROUND_TASK";

// Register background task
TaskManager.defineTask(TIMER_BACKGROUND_TASK, async () => {
  return BackgroundFetch.BackgroundFetchResult.NewData;
});

const MOTIVATIONAL_MESSAGES = [
  { message: "Great work! 🎉", subMessage: "You're building great habits!" },
  { message: "Focus Champion! 🏆", subMessage: "Another session conquered!" },
  {
    message: "Incredible Focus! ⚡",
    subMessage: "You're on a productivity streak!",
  },
  { message: "Stay Strong! 💪", subMessage: "Every session counts!" },
];

export const useTimer = (initialTime: number = 25 * 60) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState({
    message: "",
    subMessage: "",
  });
  const [isInBackground, setIsInBackground] = useState(false);

  const { settings } = useTimerSettings();
  const intervalRef = useRef<NodeJS.Timeout>();
  const backgroundTimeRef = useRef<number>();
  const appStateRef = useRef(AppState.currentState);

  const getModeDuration = (timerMode: TimerMode) => {
    switch (timerMode) {
      case "focus":
        return settings.focusDuration * 60;
      case "shortBreak":
        return settings.shortBreakDuration * 60;
      case "longBreak":
        return settings.longBreakDuration * 60;
    }
  };

  const handleSessionComplete = useCallback(async () => {
    const message = getModeMessage(mode);
    try {
      await scheduleNotification(message.title, message.body, 0);

      if (settings?.soundEnabled) {
        await soundManager.playSound("timerEnd");
      }

      if (settings.vibrationEnabled) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      if (mode === "focus") {
        const motivationalMessage = getRandomMotivationalMessage();
        setCelebrationMessage(motivationalMessage);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }

      const nextMode = mode === "focus"
        ? (completedSessions + 1) % 4 === 0 ? "longBreak" : "shortBreak"
        : "focus";

      setMode(nextMode);
      setTimeRemaining(getModeDuration(nextMode));
      setIsActive(false);

      if (mode === "focus") {
        setCompletedSessions(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error completing session:", error);
    }
  }, [mode, completedSessions, settings]);

  // Single app state effect handler
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const currentState = appStateRef.current;

      if (currentState.match(/active/) && nextAppState === "background") {
        setIsInBackground(true);
        if (isActive) {
          backgroundTimeRef.current = Date.now();
          updateBackgroundNotification(timeRemaining, mode, isActive);
        }
      } else if (currentState === "background" && nextAppState === "active") {
        setIsInBackground(false);
        Notifications.dismissAllNotificationsAsync();

        if (isActive && backgroundTimeRef.current) {
          const now = Date.now();
          const timeInBackground = now - backgroundTimeRef.current;
          const secondsInBackground = Math.floor(timeInBackground / 1000);

          setTimeRemaining(prevTime => {
            const newTime = Math.max(0, prevTime - secondsInBackground);
            if (newTime === 0 && prevTime !== 0) {
              handleSessionComplete();
            }
            return newTime;
          });
        }
      }

      appStateRef.current = nextAppState;
    });

    return () => {
      subscription.remove();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      Notifications.dismissAllNotificationsAsync();
    };
  }, [isActive, mode, timeRemaining, handleSessionComplete]);

  // Initialize sounds
  useEffect(() => {
    soundManager.loadSounds();
    return () => soundManager.unloadSounds();
  }, []);

  const startTimer = useCallback(async () => {
    try {
      if (settings?.vibrationEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      if (settings?.soundEnabled) {
        await soundManager.playSound("timerStart");
      }

      await Notifications.dismissAllNotificationsAsync();

      setIsActive(true);
      setIsPaused(false);

      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 4 && prev > 1 && settings.soundEnabled) {
            soundManager.playSound("tick");
          }

          if (prev <= 1) {
            clearInterval(intervalRef.current);
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error starting timer:", error);
    }
  }, [settings, handleSessionComplete]);

  const pauseTimer = useCallback(async () => {
    try {
      if (settings?.vibrationEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      await Notifications.dismissAllNotificationsAsync();

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setIsActive(false);
      setIsPaused(true);
    } catch (error) {
      console.error("Error pausing timer:", error);
    }
  }, [settings]);

  const resetTimer = useCallback(async () => {
    try {
      if (settings?.vibrationEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setTimeRemaining(getModeDuration(mode));
      setIsActive(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Error resetting timer:", error);
    }
  }, [mode, settings]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeRemaining(getModeDuration(newMode));
    setIsActive(false);
    setIsPaused(false);
  }, []);

  return {
    timeRemaining,
    mode,
    isActive,
    isPaused,
    completedSessions,
    progress: timeRemaining / getModeDuration(mode),
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    showCelebration,
    celebrationMessage,
  };
};