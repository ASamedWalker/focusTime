// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Audio } from 'expo-av';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const playSound = async (type: 'success' | 'start' | 'pause') => {
  try {
    const { sound } = await Audio.Sound.createAsync(
      // Using Expo's system sounds
      {
        uri: type === 'success'
          ? 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
          : type === 'start'
          ? 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'
          : 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'
      },
      { shouldPlay: true, volume: 0.5 }
    );

    await sound.playAsync();

    // Unload sound after playing
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  } catch (error) {
    console.log('Error playing sound:', error);
  }
};