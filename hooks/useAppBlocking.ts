// src/hooks/useAppBlocking.ts
import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BlockedApp {
  id: string;
  name: string;
  isBlocked: boolean;
  timestamp: number;
}

export const useAppBlocking = () => {
  const [blockedApps, setBlockedApps] = useState<BlockedApp[]>([]);

  // Load blocked apps from storage
  useEffect(() => {
    const loadBlockedApps = async () => {
      try {
        const savedApps = await AsyncStorage.getItem('@focustime/blocked_apps');
        if (savedApps) {
          setBlockedApps(JSON.parse(savedApps));
        }
      } catch (error) {
        console.error('Error loading blocked apps:', error);
      }
    };

    loadBlockedApps();
  }, []);

  // Save blocked apps to storage
  const saveBlockedApps = async (apps: BlockedApp[]) => {
    try {
      await AsyncStorage.setItem('@focustime/blocked_apps', JSON.stringify(apps));
    } catch (error) {
      console.error('Error saving blocked apps:', error);
    }
  };

  const toggleAppBlock = useCallback(async (appId: string, appName: string) => {
    const updatedApps = blockedApps.some(app => app.id === appId)
      ? blockedApps.filter(app => app.id !== appId)
      : [...blockedApps, {
          id: appId,
          name: appName,
          isBlocked: true,
          timestamp: Date.now()
        }];

    setBlockedApps(updatedApps);
    await saveBlockedApps(updatedApps);
  }, [blockedApps]);

  const getBlockedApps = useCallback(() => {
    return blockedApps.filter(app => app.isBlocked);
  }, [blockedApps]);

  return {
    blockedApps,
    toggleAppBlock,
    getBlockedApps
  };
};