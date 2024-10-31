// src/navigation/transitions.ts
import { TransitionPresets } from '@react-navigation/stack';

export const screenTransitions = {
  ...TransitionPresets.SlideFromRightIOS,
  cardStyle: { backgroundColor: 'transparent' },
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardOverlayEnabled: true,
  animationEnabled: true,
  presentation: 'card' as const,
};
