// src/components/common/StatsDisplay.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import { Card } from './Card';
import { Clock, CheckCircle2, Flame } from 'lucide-react-native';

interface StatsDisplayProps {
  totalFocusTime: number;
  completedSessions: number;
  streak: number;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  totalFocusTime,
  completedSessions,
  streak,
}) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A]">
      <View className="flex-row justify-between">
        <View className="items-center">
          <View className="bg-blue-900/20 p-3 rounded-full mb-2">
            <Clock size={20} color="#3B82F6" />
          </View>
          <Typography className="text-white text-lg font-bold">
            {formatTime(totalFocusTime)}
          </Typography>
          <Typography className="text-gray-400 text-sm">
            Focus Time
          </Typography>
        </View>

        <View className="items-center">
          <View className="bg-green-900/20 p-3 rounded-full mb-2">
            <CheckCircle2 size={20} color="#22C55E" />
          </View>
          <Typography className="text-white text-lg font-bold">
            {completedSessions}
          </Typography>
          <Typography className="text-gray-400 text-sm">
            Completed
          </Typography>
        </View>

        <View className="items-center">
          <View className="bg-orange-900/20 p-3 rounded-full mb-2">
            <Flame size={20} color="#F97316" />
          </View>
          <Typography className="text-white text-lg font-bold">
            {streak}
          </Typography>
          <Typography className="text-gray-400 text-sm">
            Day Streak
          </Typography>
        </View>
      </View>
    </Card>
  );
};