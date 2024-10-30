// src/screens/StatsScreen.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Card,
  IconButton,
  StatsDisplay
} from '../components/common';
import { ChevronLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useStatistics } from '../hooks/useStatistics';

export const StatsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { sessions, getTodayStats } = useStatistics();
  const todayStats = getTodayStats();

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <View
      className="flex-1 bg-[#121212]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
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
          <Typography variant="h3" weight="semibold" className="text-white mb-4">
            Today's Progress
          </Typography>
          <StatsDisplay
            totalFocusTime={todayStats.totalFocusTime}
            completedSessions={todayStats.completedSessions}
            streak={todayStats.streak}
          />
        </View>

        {/* Recent Sessions */}
        <View className="px-6 py-4">
          <Typography variant="h3" weight="semibold" className="text-white mb-4">
            Recent Sessions
          </Typography>
          <View className="space-y-3">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A]"
              >
                <View className="flex-row justify-between items-center">
                  <View>
                    <Typography className="text-white font-medium mb-1">
                      {session.wasCompleted ? 'Completed' : 'Incomplete'} Session
                    </Typography>
                    <Typography variant="caption" className="text-gray-400">
                      {formatDate(session.startTime)}
                    </Typography>
                  </View>
                  <Typography
                    className={`
                      ${session.wasCompleted ? 'text-green-500' : 'text-gray-400'}
                      font-medium
                    `}
                  >
                    {Math.floor(session.duration / 60)}m
                  </Typography>
                </View>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};