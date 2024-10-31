// src/components/common/Celebration.tsx
import React from 'react';
import { View, Dimensions } from 'react-native';
import { Typography } from './Typography';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';

interface CelebrationProps {
  isVisible: boolean;
  message: string;
  subMessage: string;
}

export const Celebration: React.FC<CelebrationProps> = ({
  isVisible,
  message,
  subMessage,
}) => {
  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(600)}
      exiting={FadeOut.duration(400)}
      className="absolute inset-0 bg-black/80 items-center justify-center z-50"
    >
      <View className="items-center px-6">
        <Animated.View
          entering={withDelay(300, withSpring({ transform: [{ scale: 1 }] }))}
          className="mb-4"
        >
          <Typography variant="h2" className="text-white text-center font-bold">
            {message}
          </Typography>
        </Animated.View>
        <Animated.View
          entering={withDelay(600, withSpring({ transform: [{ scale: 1 }] }))}
        >
          <Typography className="text-gray-300 text-center">
            {subMessage}
          </Typography>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

