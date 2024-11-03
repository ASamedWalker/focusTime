// src/lib/appBlocking.ts
import * as ExpoDevice from 'expo-device';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BlockedApp {
  packageName: string;
  appName: string;
  isBlocked: boolean;
}

interface AppBlockingState {
  isEnabled: boolean;
  blockedApps: BlockedApp[];
  blockSchedule: {
    startTime: string; // HH:mm format
    endTime: string;
    daysOfWeek: number[]; // 0-6, where 0 is Sunday
  };
}

// Storage keys
const BLOCKING_STATE_KEY = '@FocusTime:blockingState';

class AppBlockingManager {
  private state: AppBlockingState = {
    isEnabled: false,
    blockedApps: [],
    blockSchedule: {
      startTime: '09:00',
      endTime: '17:00',
      daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
    },
  };

  constructor() {
    this.loadState();
  }

  private async loadState() {
    try {
      const savedState = await AsyncStorage.getItem(BLOCKING_STATE_KEY);
      if (savedState) {
        this.state = JSON.parse(savedState);
      }
    } catch (error) {
      console.error('Error loading blocking state:', error);
    }
  }

  private async saveState() {
    try {
      await AsyncStorage.setItem(BLOCKING_STATE_KEY, JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving blocking state:', error);
    }
  }

  async openUsageAccessSettings() {
    if (ExpoDevice.osName === 'Android') {
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ActivityAction.USAGE_ACCESS_SETTINGS
      );
    }
  }

  async getInstalledApps(): Promise<BlockedApp[]> {
    // For Expo, we'll use a curated list of common apps since we can't access the full app list
    const commonApps = [
      { packageName: 'com.instagram.android', appName: 'Instagram' },
      { packageName: 'com.facebook.katana', appName: 'Facebook' },
      { packageName: 'com.zhiliaoapp.musically', appName: 'TikTok' },
      { packageName: 'com.twitter.android', appName: 'Twitter' },
      { packageName: 'com.whatsapp', appName: 'WhatsApp' },
      { packageName: 'com.google.android.youtube', appName: 'YouTube' },
      { packageName: 'com.snapchat.android', appName: 'Snapchat' },
      { packageName: 'com.spotify.music', appName: 'Spotify' },
      { packageName: 'com.netflix.mediaclient', appName: 'Netflix' },
      { packageName: 'com.reddit.frontpage', appName: 'Reddit' }
    ];

    return commonApps.map(app => ({
      ...app,
      isBlocked: this.state.blockedApps.some(
        blockedApp => blockedApp.packageName === app.packageName
      )
    }));
  }

  async toggleAppBlocking(packageName: string, shouldBlock: boolean) {
    if (shouldBlock) {
      const appExists = this.state.blockedApps.some(
        app => app.packageName === packageName
      );
      if (!appExists) {
        const apps = await this.getInstalledApps();
        const appToBlock = apps.find(app => app.packageName === packageName);
        if (appToBlock) {
          this.state.blockedApps.push({
            ...appToBlock,
            isBlocked: true,
          });
        }
      }
    } else {
      this.state.blockedApps = this.state.blockedApps.filter(
        app => app.packageName !== packageName
      );
    }
    await this.saveState();
  }

  async setBlockSchedule(schedule: AppBlockingState['blockSchedule']) {
    this.state.blockSchedule = schedule;
    await this.saveState();
  }

  getBlockedApps(): BlockedApp[] {
    return this.state.blockedApps;
  }

  getBlockSchedule(): AppBlockingState['blockSchedule'] {
    return this.state.blockSchedule;
  }
}

export const appBlockingManager = new AppBlockingManager();