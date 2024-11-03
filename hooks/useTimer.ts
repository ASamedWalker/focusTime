// src/hooks/useTimer.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { AppState, Platform } from "react-native";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Haptics from "expo-haptics";
import { setupNotifications, showTimerNotification } from "../lib/notifications";
import { useTimerSettings } from "../context/TimerSettingsContext";
import { soundManager } from "../lib/soundManager";
import { updateBackgroundNotification } from "../lib/notifications";
import * as Notifications from "expo-notifications";

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

  const getRandomMotivationalMessage = () => {
    const randomIndex = Math.floor(
      Math.random() * MOTIVATIONAL_MESSAGES.length
    );
    return MOTIVATIONAL_MESSAGES[randomIndex];
  };

  const getModeMessage = (currentMode: TimerMode) => {
    switch (currentMode) {
      case "focus":
        return {
          title: "🎯 Focus Session Complete!",
          body: "Great work! Take a well-deserved break.",
        };
      case "shortBreak":
        return {
          title: "⏰ Break Time Over",
          body: "Ready to focus again?",
        };
      case "longBreak":
        return {
          title: "🌟 Long Break Complete",
          body: "Feeling refreshed? Let's get back to work!",
        };
    }
  };

  // const handleSessionComplete = useCallback(async () => {
  //   // Clear any existing interval
  //   if (intervalRef.current) {
  //     clearInterval(intervalRef.current);
  //   }

  //   const message = getModeMessage(mode);
  //   try {
  //     await scheduleNotification(message.title, message.body, 0);

  //     if (settings?.soundEnabled) {
  //       await soundManager.playSound("timerEnd");
  //     }

  //     if (settings?.vibrationEnabled) {
  //       await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  //     }

  //     // Show motivational message for all sessions
  //     const motivationalMessage = getRandomMotivationalMessage();
  //     setCelebrationMessage(motivationalMessage);
  //     setShowCelebration(true);
  //     setTimeout(() => setShowCelebration(false), 3000);

  //     const nextMode = mode === "focus"
  //       ? (completedSessions + 1) % 4 === 0 ? "longBreak" : "shortBreak"
  //       : "focus";

  //     if (mode === "focus") {
  //       setCompletedSessions(prev => prev + 1);
  //     }

  //     setMode(nextMode);
  //     setTimeRemaining(getModeDuration(nextMode));
  //     setIsActive(false);
  //     setIsPaused(false);
  //   } catch (error) {
  //     console.error("Error completing session:", error);
  //   }
  // }, [mode, completedSessions, settings]);

  const handleSessionComplete = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    try {
      // Show message first
      const motivationalMessage = getRandomMotivationalMessage();
      setCelebrationMessage(motivationalMessage);
      setShowCelebration(true);

      // Show completion notification with motivational message
      await showTimerNotification(mode, motivationalMessage.message);

      // Show notification
      const message = getModeMessage(mode);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: message.title,
          body: message.body,
          sound: true,
          priority: "high",
        },
        trigger: null,
      });

      if (settings?.soundEnabled) {
        await soundManager.playSound("timerEnd");
      }

      if (settings?.vibrationEnabled) {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      }

      setTimeout(() => setShowCelebration(false), 3000);

      const nextMode =
        mode === "focus"
          ? (completedSessions + 1) % 4 === 0
            ? "longBreak"
            : "shortBreak"
          : "focus";

      if (mode === "focus") {
        setCompletedSessions((prev) => prev + 1);
      }

      setMode(nextMode);
      setTimeRemaining(getModeDuration(nextMode));
      setIsActive(false);
      setIsPaused(false);
    } catch (error) {
      console.error("Error completing session:", error);
    }
  }, [mode, completedSessions, settings]);

  const startTimer = useCallback(async () => {
    try {
      if (settings?.vibrationEnabled) {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      if (settings?.soundEnabled) {
        await soundManager.playSound("timerStart");
      }

      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      setIsActive(true);
      setIsPaused(false);

      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (settings?.vibrationEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setIsActive(false);
    setIsPaused(true);
  }, [settings]);

  const resetTimer = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (settings?.vibrationEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    setTimeRemaining(getModeDuration(mode));
    setIsActive(false);
    setIsPaused(false);
  }, [mode, settings]);

  // Simple app state handling
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appStateRef.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        isActive
      ) {
        // Resume timer with adjusted time
        const now = Date.now();
        const backgroundStart =
          appStateRef.current === "background" ? now : undefined;
        if (backgroundStart) {
          const timeElapsed = Math.floor((now - backgroundStart) / 1000);
          setTimeRemaining((prev) => {
            const newTime = Math.max(0, prev - timeElapsed);
            if (newTime === 0) {
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
    };
  }, [isActive, handleSessionComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize sounds
  useEffect(() => {
    soundManager.loadSounds();
    return () => {
      soundManager.unloadSounds();
    };
  }, []);

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
