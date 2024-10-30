// src/screens/TimerScreen.tsx
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Typography,
  Card,
  Button,
  IconButton,
  CircularProgress,
} from "../components/common";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  Coffee,
  Timer as TimerIcon,
} from "lucide-react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  Layout,
} from "react-native-reanimated";
import { useTimer, TimerMode } from "../hooks/useTimer";
import { cn } from "../lib/utils";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getModeColor = (mode: "focus" | "shortBreak" | "longBreak") => {
  switch (mode) {
    case "focus":
      return "blue";
    case "shortBreak":
      return "green";
    case "longBreak":
      return "purple";
  }
};

const getModeText = (mode: "focus" | "shortBreak" | "longBreak") => {
  switch (mode) {
    case "focus":
      return "Focus Session";
    case "shortBreak":
      return "Short Break";
    case "longBreak":
      return "Long Break";
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const TimerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const {
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
  } = useTimer();

  const modeColor = getModeColor(mode);

  return (
    <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <Animated.View
        entering={FadeIn}
        className="px-6 py-4 flex-row justify-between items-center"
      >
          <IconButton
            icon={<ChevronLeft size={24} color="#fff" />}
            onPress={() => navigation.goBack()}
            variant="dark"
          />
          <View className="flex-row space-x-4">
            <IconButton
              icon={<Coffee size={22} color="#fff" />}
              onPress={() =>
                switchMode(mode === "focus" ? "shortBreak" : "focus")
              }
              variant="dark"
            />
            <IconButton
              icon={<TimerIcon size={22} color="#fff" />}
              onPress={() => {}}
              variant="dark"
            />
          </View>
      </Animated.View>

      <View className="flex-1 px-6">
        <Animated.View
          entering={SlideInDown.delay(300)}
          className="items-center justify-center flex-1">
          {/* Timer Display */}
          <CircularProgress
            size={300}
            strokeWidth={12}
            progress={progress}
            mode={mode}
          >
            <Animated.View
              entering={FadeIn.duration(800)}
              className="items-center"
            >
              <Typography
                variant="h1"
                className="text-white text-6xl font-bold"
              >
                {formatTime(timeRemaining)}
              </Typography>
              <Typography
                className={cn(
                  "mt-2",
                  mode === 'focus' ? 'text-blue-400' :
                  mode === 'shortBreak' ? 'text-green-400' :
                  'text-purple-400'
                )}
              >
                {getModeText(mode)}
              </Typography>
            </Animated.View>
          </CircularProgress>


          {/* Timer Controls */}
          <Animated.View
            className="mt-12 w-full space-y-6"
            layout={Layout.springify()}
          >
            <View className="flex-row justify-center space-x-4">
              <Button
                icon={isActive ?
                  <Pause size={24} color="#fff" /> :
                  <Play size={24} color="#fff" />
                }
                title={isActive ? "Pause" : "Start"}
                onPress={isActive ? pauseTimer : startTimer}
                className={cn(
                  "w-48 h-14",
                  mode === 'focus' ? 'bg-blue-600' :
                  mode === 'shortBreak' ? 'bg-green-600' :
                  'bg-purple-600'
                )}
              />
              {(isActive || isPaused) && (
                <Animated.View
                  entering={FadeIn}
                  exiting={FadeOut}
                >
                  <IconButton
                    icon={<RotateCcw size={24} color="#fff" />}
                    onPress={resetTimer}
                    variant="dark"
                    className="h-14 w-14 bg-[#2A2A2A]"
                  />
                </Animated.View>
              )}
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};
