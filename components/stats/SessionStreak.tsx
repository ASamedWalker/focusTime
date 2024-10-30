// src/components/stats/SessionStreak.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography, Card } from '../common';
import { Flame } from 'lucide-react-native';

interface SessionStreakProps {
  currentStreak: number;
  bestStreak: number;
  totalSessions: number;
}

export const SessionStreak: React.FC<SessionStreakProps> = ({
  currentStreak,
  bestStreak,
  totalSessions,
}) => {
  return (
    <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A]">
      <View className="flex-row items-center space-x-3 mb-4">
        <View className="bg-orange-900/20 p-3 rounded-full">
          <Flame size={24} color="#F97316" />
        </View>
        <View>
          <Typography className="text-white font-medium text-lg">
            {currentStreak} Day Streak
          </Typography>
          <Typography className="text-gray-400">
            Keep it going!
          </Typography>
        </View>
      </View>
      <View className="flex-row justify-between">
        <View>
          <Typography className="text-gray-400 mb-1">Best Streak</Typography>
          <Typography className="text-white font-medium">
            {bestStreak} Days
          </Typography>
        </View>
        <View>
          <Typography className="text-gray-400 mb-1">Total Sessions</Typography>
          <Typography className="text-white font-medium">
            {totalSessions}
          </Typography>
        </View>
      </View>
    </Card>
  );
};