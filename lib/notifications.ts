// src/utils/notifications.ts
import * as Notifications from 'expo-notifications';

export async function setupNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status === 'granted') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }

  return status;
}

export async function scheduleNotification(
  title: string,
  body: string,
  seconds: number
) {
  try {
    // Instead of using a delay, show notification immediately
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // This makes it show immediately
    });
  } catch (error) {
    console.error('Error scheduling notification:', error);
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