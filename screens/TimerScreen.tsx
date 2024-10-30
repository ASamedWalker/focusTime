// src/screens/TimerScreen.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
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
  Bell,
  Lock,
} from "lucide-react-native";
import { useTimer } from "../hooks/useTimer";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { cn } from "../lib/utils";

const FOCUS_TIMES = [
  { label: "15", value: 15 * 60 },
  { label: "25", value: 25 * 60 },
  { label: "45", value: 45 * 60 },
];

// Add this helper function
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

export const TimerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    timeRemaining,
    isActive,
    isPaused,
    startTimer,
    pauseTimer,
    resetTimer,
    progress
  } = useTimer(25 * 60);

  return (
    <View
      className="flex-1 bg-[#121212]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <IconButton
          icon={<ChevronLeft size={24} color="#fff" />}
          onPress={() => navigation.goBack()}
          variant="dark"
        />
        <View className="flex-row space-x-4">
          <IconButton
            icon={<Lock size={22} color="#fff" />}
            onPress={() => {}}
            variant="dark"
          />
          <IconButton
            icon={<Bell size={22} color="#fff" />}
            onPress={() => {}}
            variant="dark"
          />
        </View>
      </View>

      {/* Timer Display */}
      <View className="flex-1 px-6">
        <View className="items-center justify-center flex-1">
          <CircularProgress
            size={300}
            strokeWidth={12}
            progress={progress}
          >
            <View className="items-center">
              <Typography
                variant="h1"
                className="text-white text-6xl font-bold"
              >
                {formatTime(timeRemaining)}
              </Typography>
              <Typography className="text-gray-400 mt-2">
                {isActive ? "Focusing..." : "Focus Session"}
              </Typography>
            </View>
          </CircularProgress>

          {/* Timer Controls */}
          <View className="mt-12 w-full space-y-6">
            <View className="flex-row justify-center space-x-4">
              <Button
                icon={isActive ?
                  <Pause size={24} color="#fff" /> :
                  <Play size={24} color="#fff" />
                }
                title={isActive ? "Pause" : "Start"}
                onPress={isActive ? pauseTimer : startTimer}
                className="w-48 h-14 bg-blue-600"
              />
              {(isActive || isPaused) && (
                <IconButton
                  icon={<RotateCcw size={24} color="#fff" />}
                  onPress={() => resetTimer()}
                  variant="dark"
                  className="h-14 w-14 bg-[#2A2A2A]"
                />
              )}
            </View>

            {/* Time Presets */}
            <Card className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#2A2A2A]">
              <View className="flex-row justify-between">
                {FOCUS_TIMES.map((time) => (
                  <TouchableOpacity
                    key={time.value}
                    className={`
                      px-6 py-3 rounded-xl
                      ${time.value === 25 * 60 ? "bg-[#2A2A2A]" : "bg-transparent"}
                    `}
                    onPress={() => {
                      if (!isActive) {
                        resetTimer(time.value);
                      }
                    }}
                  >
                    <Typography
                      className={`
                        text-center
                        ${time.value === 25 * 60 ? "text-white" : "text-gray-400"}
                      `}
                    >
                      {time.label}m
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>
          </View>
        </View>
      </View>
    </View>
  );
};
