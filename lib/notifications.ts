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
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: {
      seconds,
    },
  });
}