// src/components/common/Button.tsx
import React from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Typography } from './Typography';
import { cn } from '../../lib/utils';

interface ButtonProps {
  onPress: () => void;
  title: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  className?: string;
  textClassName?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className,
  textClassName
}) => {
  const variantClasses = {
    primary: 'bg-blue-500 active:bg-blue-600',
    secondary: 'bg-[#2A2A2A] active:bg-[#333333]',
    outline: 'border border-[#333333] bg-transparent'
  };

  const sizeClasses = {
    sm: 'py-2 px-4',
    md: 'py-3 px-6',
    lg: 'py-4 px-8 text-lg'
  };

  const textColorClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-500'
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        'flex-row justify-center items-center rounded-xl',
        sizeClasses[size],
        variantClasses[variant],
        disabled ? 'opacity-50' : '',
        fullWidth ? 'w-full' : 'w-auto',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#3B82F6' : '#FFFFFF'} />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Typography
            weight="medium"
            className={cn(
              textColorClasses[variant],
              textClassName
            )}
          >
            {title}
          </Typography>
        </>
      )}
    </TouchableOpacity>
  );
};