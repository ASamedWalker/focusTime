// src/components/common/IconBox.tsx
import React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { Typography } from './Typography';

interface IconBoxProps {
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export const IconBox: React.FC<IconBoxProps> = ({
  icon,
  label,
  variant = 'primary',
  className
}) => {
  return (
    <View className={cn('items-center', className)}>
      <View className={cn(
        'p-4 rounded-2xl mb-2',
        variant === 'primary' ? 'bg-[#2A2A2A]' : 'bg-blue-500'
      )}>
        {icon}
      </View>
      <Typography variant="caption" className="text-gray-400">
        {label}
      </Typography>
    </View>
  );
};
