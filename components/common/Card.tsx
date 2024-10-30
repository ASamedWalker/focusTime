// src/components/common/Card.tsx
import React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'dark';
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className
}) => {
  return (
    <View
      className={cn(
        'p-6 rounded-2xl',
        variant === 'default' ? 'bg-white' : 'bg-[#1E1E1E] border border-[#333333]',
        className
      )}
    >
      {children}
    </View>
  );
};
