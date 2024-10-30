// src/components/common/QuickBlockCard.tsx
import React from 'react';
import { View } from 'react-native';
import { Card } from './Card';
import { Button } from './Button';
import { Typography } from './Typography';
import { Shield, Play } from 'lucide-react-native';

interface QuickBlockCardProps {
  onStartPress: () => void;
  blockedAppsCount: number;
}

export const QuickBlockCard: React.FC<QuickBlockCardProps> = ({
  onStartPress,
  blockedAppsCount
}) => {
  return (
    <Card variant="dark" className="p-6">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Typography variant="h3" weight="bold" className="text-white mb-1">
            Quick Block
          </Typography>
          <Typography variant="caption" className="text-gray-400">
            Block apps with one tap
          </Typography>
        </View>
        <View className="bg-[#2A2A2A] px-3 py-1.5 rounded-full flex-row items-center">
          <Shield size={14} color="#3B82F6" />
          <Typography className="text-white ml-2">
            {blockedAppsCount}
          </Typography>
        </View>
      </View>

      <Button
        title="Start"
        icon={<Play size={20} color="#fff" />}
        onPress={onStartPress}
        className="h-14 mb-4"
      />

      <Card className="bg-[#1A1A1A] p-4 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Shield size={20} color="#3B82F6" />
          <Typography className="text-white ml-3">Timer</Typography>
        </View>
        <View className="bg-[#2A2A2A] px-2 py-1 rounded-md">
          <Typography variant="caption" className="text-amber-400">
            Premium
          </Typography>
        </View>
      </Card>
    </Card>
  );
};