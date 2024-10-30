// src/components/common/Header.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import { IconButton } from './IconButton';
import { cn } from '../../lib/utils';

interface HeaderProps {
  title: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  icon,
  rightIcon,
  onRightIconPress,
  className
}) => {
  return (
    <View className={cn('flex-row justify-between items-center p-6', className)}>
      <View className="flex-row items-center space-x-3">
        {icon && (
          <View className="bg-blue-500 p-2 rounded-xl">
            {icon}
          </View>
        )}
        <Typography variant="h2" weight="bold" className="text-white">
          {title}
        </Typography>
      </View>
      {rightIcon && (
        <IconButton
          icon={rightIcon}
          onPress={onRightIconPress}
          variant="dark"
        />
      )}
    </View>
  );
};