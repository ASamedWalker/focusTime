// src/components/stats/AchievementBadge.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Typography } from '../common/Typography';
import { Award, Lock } from 'lucide-react-native';

interface AchievementBadgeProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isUnlocked: boolean;
  progress?: number;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  icon,
  title,
  description,
  isUnlocked,
  progress
}) => {
  return (
    <TouchableOpacity
      className={`
        p-4 rounded-xl border
        ${isUnlocked ? 'bg-[#1E1E1E] border-[#2A2A2A]' : 'bg-[#1E1E1E]/50 border-[#2A2A2A]/50'}
      `}
    >
      <View className="flex-row items-center space-x-3">
        <View className={`
          p-3 rounded-full
          ${isUnlocked ? 'bg-blue-900/20' : 'bg-gray-800/20'}
        `}>
          {isUnlocked ? icon : <Lock size={20} color="#6B7280" />}
        </View>
        <View className="flex-1">
          <Typography
            className={`
              font-medium mb-1
              ${isUnlocked ? 'text-white' : 'text-gray-400'}
            `}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            className="text-gray-400"
          >
            {description}
          </Typography>
          {progress !== undefined && (
            <View className="mt-2">
              <View className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <View
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </View>
              <Typography
                variant="caption"
                className="text-gray-400 mt-1"
              >
                {progress}%
              </Typography>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
