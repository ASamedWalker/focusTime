// src/components/common/CircularProgress.tsx
import React from 'react';
import { View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { cn } from '../../lib/utils';
import Animated, {
  useAnimatedProps,
  withTiming,
  withSpring,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  children?: React.ReactNode;
  mode: 'focus' | 'shortBreak' | 'longBreak';
}

const getModeColor = (mode: 'focus' | 'shortBreak' | 'longBreak') => {
  switch (mode) {
    case 'focus':
      return '#3B82F6'; // blue
    case 'shortBreak':
      return '#22C55E'; // green
    case 'longBreak':
      return '#8B5CF6'; // purple
  }
};

export const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  children,
  mode
}) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: withTiming(
      circumference - (progress * circumference),
      { duration: 500 }
    ),
  }));

  return (
    <View className={cn("items-center justify-center")}>
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
        {/* Progress Circle */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={getModeColor(mode)}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={`${circumference} ${circumference}`}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View className="absolute">
        <Animated.View>
          {children}
        </Animated.View>
      </View>
    </View>
  );
};