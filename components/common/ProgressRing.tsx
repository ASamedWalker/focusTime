// src/components/common/ProgressRing.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  progress: number;
  size: number;
  strokeWidth: number;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size,
  strokeWidth,
  mode,
  children,
}) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: withTiming(
        circumference - (progress * circumference),
        { duration: 600 }
      ),
    };
  });

  const getColor = () => {
    switch (mode) {
      case 'focus':
        return '#3B82F6';
      case 'shortBreak':
        return '#10B981';
      case 'longBreak':
        return '#8B5CF6';
    }
  };

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#2A2A2A"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Gradient Path */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View className="absolute">
        {children}
      </View>
    </View>
  );
};