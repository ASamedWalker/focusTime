export interface AppInfo {
  id: string;
  name: string;
  packageName: string;
  isBlocked: boolean;
}

export interface FocusSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  blockedAppsCount: number;
}

export interface UserSettings {
  notifications: boolean;
  strictMode: boolean;
  defaultFocusDuration: number;
  defaultBreakDuration: number;
}