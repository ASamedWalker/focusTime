// src/hooks/useTimer.ts
import { useState, useCallback, useRef, useEffect } from "react";
import { AppState } from "react-native";
import * as Haptics from "expo-haptics";
import { scheduleNotification, setupNotifications } from "../lib/notifications";

export type TimerMode = "focus" | "shortBreak" | "longBreak";

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

  const intervalRef = useRef<NodeJS.Timeout>();
  const backgroundTimeRef = useRef<number>();

  const getRandomMotivationalMessage = () => {
    const randomIndex = Math.floor(
      Math.random() * MOTIVATIONAL_MESSAGES.length
    );
    return MOTIVATIONAL_MESSAGES[randomIndex];
  };

  const getModeDuration = (timerMode: TimerMode) => {
    switch (timerMode) {
      case "focus":
        return 25 * 60; // 25 minutes
      case "shortBreak":
        return 5 * 60; // 5 minutes
      case "longBreak":
        return 15 * 60; // 15 minutes
    }
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

  const handleSessionComplete = useCallback(async () => {
    const message = getModeMessage(mode);
    await scheduleNotification(message.title, message.body, 0);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (mode === "focus") {
      const motivationalMessage = getRandomMotivationalMessage();
      setCelebrationMessage(motivationalMessage);
      setShowCelebration(true);

      // Hide celebration after 3 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
    }

    const nextMode =
      mode === "focus"
        ? (completedSessions + 1) % 4 === 0
          ? "longBreak"
          : "shortBreak"
        : "focus";

    setMode(nextMode);
    setTimeRemaining(getModeDuration(nextMode));
    setIsActive(false);
    if (mode === "focus") {
      setCompletedSessions((prev) => prev + 1);
    }
  }, [mode, completedSessions]);

  const startTimer = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(true);
    setIsPaused(false);

    intervalRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current as NodeJS.Timeout);
          handleSessionComplete();
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleSessionComplete]);

  const pauseTimer = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsActive(false);
    setIsPaused(true);
  }, []);

  const resetTimer = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setTimeRemaining(getModeDuration(mode));
    setIsActive(false);
    setIsPaused(false);
  }, [mode]);

  const switchMode = useCallback((newMode: TimerMode) => {
    setMode(newMode);
    setTimeRemaining(getModeDuration(newMode));
    setIsActive(false);
    setIsPaused(false);
  }, []);

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active" && backgroundTimeRef.current && isActive) {
        const now = Date.now();
        const timeInBackground = now - backgroundTimeRef.current;
        setTimeRemaining((prev) =>
          Math.max(0, prev - Math.floor(timeInBackground / 1000))
        );
      } else if (nextAppState === "background" && isActive) {
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
    completedSessions,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    showCelebration,
    celebrationMessage,
  };
};
