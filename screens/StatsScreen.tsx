// src/screens/StatsScreen.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  IconButton,
  StatsDisplay
} from '../components/common';
import {
  ChevronLeft,
  Timer,
  Target,
  Zap,
  Trophy
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStatistics } from '../hooks/useStatistics';
import { FocusChart } from '../components/stats/FocusChart';
import { AchievementBadge } from '../components/stats/AchievementBadge';
import { SessionStreak } from '../components/stats/SessionStreak';

export const StatsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { sessions, dailyStats, getTodayStats } = useStatistics();
  const todayStats = getTodayStats();

  const weeklyData = [
    { day: 'Mon', minutes: 120 },
    { day: 'Tue', minutes: 90 },
    { day: 'Wed', minutes: 150 },
    { day: 'Thu', minutes: 85 },
    { day: 'Fri', minutes: 130 },
    { day: 'Sat', minutes: 45 },
    { day: 'Sun', minutes: 75 },
  ];

  const achievements = [
    {
      icon: <Timer size={20} color="#3B82F6" />,
      title: "Focus Master",
      description: "Complete 10 focus sessions",
      isUnlocked: todayStats.completedSessions >= 10,
      progress: Math.min((todayStats.completedSessions / 10) * 100, 100),
    },
    {
      icon: <Target size={20} color="#3B82F6" />,
      title: "Consistency King",
      description: "Maintain a 7-day streak",
      isUnlocked: todayStats.streak >= 7,
      progress: Math.min((todayStats.streak / 7) * 100, 100),
    },
    {
      icon: <Zap size={20} color="#3B82F6" />,
      title: "Productivity Pro",
      description: "Focus for 4 hours in a day",
      isUnlocked: todayStats.totalFocusTime >= 14400,
      progress: Math.min((todayStats.totalFocusTime / 14400) * 100, 100),
    },
  ];

  return (
    <View
      className="flex-1 bg-[#121212]"
      style={{ paddingTop: insets.top }}
    >
      <View className="px-6 py-4 flex-row items-center">
        <IconButton
          icon={<ChevronLeft size={24} color="#fff" />}
          onPress={() => navigation.goBack()}
          variant="dark"
        />
        <Typography variant="h2" weight="bold" className="text-white ml-4">
          Statistics
        </Typography>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Today's Stats */}
        <View className="px-6 py-2">
          <StatsDisplay
            totalFocusTime={todayStats.totalFocusTime}
            completedSessions={todayStats.completedSessions}
            streak={todayStats.streak}
          />
        </View>

        {/* Weekly Chart */}
        <View className="px-6 py-4">
          <FocusChart data={weeklyData} />
        </View>

        {/* Streak Information */}
        <View className="px-6 py-2">
          <SessionStreak
            currentStreak={todayStats.streak}
            bestStreak={10}
            totalSessions={todayStats.totalSessions}
          />
        </View>

        {/* Achievements */}
        <View className="px-6 py-4">
          <Typography variant="h3" weight="semibold" className="text-white mb-4">
            Achievements
          </Typography>
          <View className="space-y-4">
            {achievements.map((achievement, index) => (
              <AchievementBadge
                key={index}
                {...achievement}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};