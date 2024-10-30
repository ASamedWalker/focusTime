// src/components/common/IconButton.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { cn } from '../../lib/utils';

interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'dark';
  className?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  className
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        'p-2 rounded-full',
        variant === 'default' ? 'bg-gray-100' : 'bg-[#2A2A2A]',
        className
      )}
    >
      {icon}
    </TouchableOpacity>
  );
};