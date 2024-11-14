// src/types/navigation.ts
export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Timer: {
    task?: {
      id: string;
      title: string;
      duration?: number;
    }
  } | undefined;
  Profile: undefined;
  Stats: undefined;
  BlockedApps: undefined;
  TimerSettings: undefined;
  Tasks: undefined;
  TaskDetail?: { taskId: string };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
