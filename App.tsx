// App.tsx
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Navigation } from './navigation';
import { TimerSettingsProvider } from './context/TimerSettingsContext';
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <TimerSettingsProvider>
        <Navigation />
      </TimerSettingsProvider>
    </SafeAreaProvider>
  );
}