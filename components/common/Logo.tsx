import React from 'react';
import { View } from 'react-native';
import { Typography } from './Typography';
import { Crosshair } from 'lucide-react-native';
import { cn } from '../../lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className
}) => {
  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <View className="flex-row items-center">
      <View className={cn(
        'bg-[#1E1E1E] rounded-xl mr-3 items-center justify-center',
        containerSizes[size],
        className
      )}>
        <Crosshair
          size={iconSizes[size]}
          color="#FF6B6B"
          strokeWidth={2.5}
        />
      </View>
      <View>
        <View className="flex-row items-center">
          <Typography
            weight="bold"
            className={cn(textSizes[size], 'text-[#FF6B6B] mr-1')}
          >
            Focus
          </Typography>
          <Typography
            weight="bold"
            className={cn(textSizes[size], 'text-[#4ECDC4]')}
          >
            Time
          </Typography>
        </View>
      </View>
    </View>
  );
};