// src/context/TimerSettingsContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

interface TimerSettingsContextType {
  settings: TimerSettings;
  updateSettings: (newSettings: Partial<TimerSettings>) => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  soundEnabled: true,
  vibrationEnabled: true,
};

const TimerSettingsContext = createContext<TimerSettingsContextType | undefined>(undefined);

export const TimerSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<TimerSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@timer_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<TimerSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await AsyncStorage.setItem('@timer_settings', JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <TimerSettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </TimerSettingsContext.Provider>
  );
};

export const useTimerSettings = () => {
  const context = useContext(TimerSettingsContext);
  if (context === undefined) {
    throw new Error('useTimerSettings must be used within a TimerSettingsProvider');
  }
  return context;
};