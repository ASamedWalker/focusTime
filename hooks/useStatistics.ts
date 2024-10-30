// src/hooks/useStatistics.ts
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FocusSession, DailyStatistics } from '../types/statistics';

const STORAGE_KEYS = {
  SESSIONS: '@focustime/sessions',
  DAILY_STATS: '@focustime/daily_stats',
};

export const useStatistics = () => {
  const [sessions, setSessions] = useState<FocusSession[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStatistics>({
    totalFocusTime: 0,
    sessionsCompleted: 0,
    dailyStreak: 0,
    lastSessionDate: new Date(),
  });

  // Load statistics from storage
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [sessionsData, dailyStatsData] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.SESSIONS),
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_STATS),
        ]);

        if (sessionsData) {
          setSessions(JSON.parse(sessionsData));
        }
        if (dailyStatsData) {
          setDailyStats(JSON.parse(dailyStatsData));
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    };

    loadStats();
  }, []);

  // Record new session
  const recordSession = useCallback(async (session: Omit<FocusSession, 'id'>) => {
    try {
      const newSession: FocusSession = {
        ...session,
        id: Date.now().toString(),
      };

      const updatedSessions = [newSession, ...sessions].slice(0, 50); // Keep last 50 sessions
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updatedSessions));
      setSessions(updatedSessions);

      // Update daily statistics
      const today = new Date().toDateString();
      const lastSessionDay = new Date(dailyStats.lastSessionDate).toDateString();
      const isNewDay = today !== lastSessionDay;

      const newDailyStats: DailyStatistics = {
        totalFocusTime: isNewDay ? session.duration : dailyStats.totalFocusTime + session.duration,
        sessionsCompleted: isNewDay ? 1 : dailyStats.sessionsCompleted + 1,
        dailyStreak: isNewDay ? dailyStats.dailyStreak + 1 : dailyStats.dailyStreak,
        lastSessionDate: new Date(),
      };

      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(newDailyStats));
      setDailyStats(newDailyStats);
    } catch (error) {
      console.error('Error recording session:', error);
    }
  }, [sessions, dailyStats]);

  // Get today's statistics
  const getTodayStats = useCallback(() => {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(
      session => new Date(session.startTime).toDateString() === today
    );

    return {
      totalSessions: todaySessions.length,
      totalFocusTime: dailyStats.totalFocusTime,
      completedSessions: todaySessions.filter(s => s.wasCompleted).length,
      streak: dailyStats.dailyStreak,
    };
  }, [sessions, dailyStats]);

  return {
    sessions,
    dailyStats,
    recordSession,
    getTodayStats,
  };
};