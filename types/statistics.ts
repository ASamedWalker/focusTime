// src/types/statistics.ts
export interface FocusSession {
  id: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  wasCompleted: boolean;
  mode: 'focus' | 'shortBreak' | 'longBreak';
}

export interface DailyStatistics {
  totalFocusTime: number;
  sessionsCompleted: number;
  dailyStreak: number;
  lastSessionDate: Date;
}