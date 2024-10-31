// src/screens/TimerScreen.tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Button,
  IconButton,
  CircularProgress
} from '../components/common';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  Coffee,
  Timer as TimerIcon
} from 'lucide-react-native';
import { useTimer, TimerMode } from '../hooks/useTimer';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';
import { setupNotifications } from '../lib/notifications';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getModeColor = (mode: TimerMode) => {
  switch (mode) {
    case 'focus':
      return 'blue';
    case 'shortBreak':
      return 'green';
    case 'longBreak':
      return 'purple';
  }
};

const getModeText = (mode: TimerMode) => {
  switch (mode) {
    case 'focus':
      return 'Focus Session';
    case 'shortBreak':
      return 'Short Break';
    case 'longBreak':
      return 'Long Break';
  }
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
    switchMode
  } = useTimer();

  useEffect(() => {
    setupNotifications();
  }, []);

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
            icon={<Coffee size={22} color="#fff" />}
            onPress={() => switchMode(mode === 'focus' ? 'shortBreak' : 'focus')}
            variant="dark"
          />
          <IconButton
            icon={<TimerIcon size={22} color="#fff" />}
            onPress={() => {}}
            variant="dark"
          />
        </View>
      </View>

      <View className="flex-1 px-6">
        <View className="items-center justify-center flex-1">
          {/* Session Counter */}
          <View className="items-center mb-6">
            <Typography
              className="text-gray-400 mb-2"
            >
              Session {completedSessions + 1}
            </Typography>
            <Typography variant="h3" className="text-white">
              {getModeText(mode)}
            </Typography>
          </View>

          {/* Timer Display */}
          <CircularProgress
            size={300}
            strokeWidth={12}
            progress={progress}
            mode={mode}
          >
            <View className="items-center">
              <Typography
                variant="h1"
                className="text-white text-6xl font-bold"
              >
                {formatTime(timeRemaining)}
              </Typography>
              <Typography className="text-gray-400 mt-2">
                {isActive ? "In Progress..." : "Ready"}
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
                  onPress={resetTimer}
                  variant="dark"
                  className="h-14 w-14 bg-[#2A2A2A]"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
