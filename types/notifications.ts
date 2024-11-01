// src/types/notifications.ts
import * as Notifications from 'expo-notifications';

export interface NotificationHandler {
  handleNotification: () => Promise<{
    shouldShowAlert: boolean;
    shouldPlaySound: boolean;
    shouldSetBadge: boolean;
    priority?: Notifications.AndroidNotificationPriority;
  }>;
}