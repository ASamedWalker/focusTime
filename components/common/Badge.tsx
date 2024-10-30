// src/components/common/Badge.tsx
import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import { cn } from '../../lib/utils';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'premium' | 'warning';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  className
}) => {
  const variantClasses = {
    default: 'bg-blue-100 text-blue-600',
    premium: 'bg-[#333333] text-amber-500',
    warning: 'bg-red-100 text-red-600'
  };

  return (
    <View
      className={cn(
        'px-2 py-1 rounded-md',
        variantClasses[variant],
        className
      )}
    >
      <Typography variant="caption" className={variantClasses[variant]}>
        {label}
      </Typography>
    </View>
  );
};
