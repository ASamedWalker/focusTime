// src/components/apps/AppItem.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography, Card, Button } from '../common';
import { Smartphone } from 'lucide-react-native';

interface AppItemProps {
  app: {
    id: string;
    name: string;
    isBlocked: boolean;
    icon?: string;
  };
  onToggle: () => void;
}

export const AppItem: React.FC<AppItemProps> = ({ app, onToggle }) => {
  return (
    <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A]">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="bg-[#2A2A2A] p-2 rounded-lg mr-3">
            <Smartphone size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Typography className="text-white font-medium">
              {app.name}
            </Typography>
          </View>
        </View>
        <Button
          variant={app.isBlocked ? 'primary' : 'outline'}
          title={app.isBlocked ? 'Blocked' : 'Block'}
          onPress={onToggle}
          className={`
            px-4 h-9
            ${app.isBlocked ? 'bg-blue-600' : 'border-[#2A2A2A]'}
          `}
        />
      </View>
    </Card>
  );
};