// src/lib/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notifications once at app startup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// Different notification styles for different timer states
const notificationStyles = {
  focus: {
    title: "🎯 Focus Session Complete!",
    body: "Great work! Time for a break.",
    color: '#3B82F6', // blue
  },
  shortBreak: {
    title: "⏰ Break Complete",
    body: "Ready to focus again?",
    color: '#22C55E', // green
  },
  longBreak: {
    title: "🌟 Long Break Complete",
    body: "Feeling refreshed? Let's get back to work!",
    color: '#8B5CF6', // purple
  }
};

export async function setupNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status === 'granted') {
    // Set up categories for different actions
    await Notifications.setNotificationCategoryAsync('timer', [
      {
        identifier: 'start',
        buttonTitle: 'Start Next Session',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        }
      }
    ]);
  }

  return status;
}

export async function showTimerNotification(
  mode: 'focus' | 'shortBreak' | 'longBreak',
  customMessage?: string
) {
  try {
    const style = notificationStyles[mode];
    await Notifications.scheduleNotificationAsync({
      content: {
        title: style.title,
        body: customMessage || style.body,
        sound: true,
        priority: 'high',
        color: style.color,
        categoryIdentifier: 'timer',
        data: { mode }
      },
      trigger: null,  // Show immediately
    });
  } catch (error) {
    console.error('Error showing notification:', error);
  }
}

export async function updateBackgroundNotification(
  timeRemaining: number,
  mode: string,
  isActive: boolean
) {
  if (!isActive) return;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  const modeText = {
    focus: 'Focus Session',
    shortBreak: 'Short Break',
    longBreak: 'Long Break'
  }[mode];

  try {
    await Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        priority: Notifications.AndroidNotificationPriority.LOW
      }),
    });

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${modeText} in Progress`,
        body: `${timeString} remaining`,
        data: { type: 'background-update' },
      },
      trigger: null
    });
  } catch (error) {
    console.error('Error updating background notification:', error);
  }
}