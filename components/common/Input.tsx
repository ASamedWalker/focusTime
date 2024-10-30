// src/components/common/Input.tsx
import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  className
}) => {
  return (
    <View className={cn('w-full', className)}>
      {label && (
        <Text className="text-gray-700 text-sm mb-1">
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        className={cn(
          'w-full px-4 py-3 rounded-lg bg-gray-50 border',
          error ? 'border-red-500' : 'border-gray-200'
        )}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
};
