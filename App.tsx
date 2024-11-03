// App.tsx
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Navigation } from "./navigation";
import { TimerSettingsProvider } from "./context/TimerSettingsContext";
import { TaskProvider } from "./context/TaskContext";
import "./global.css";

export default function App() {
  return (
    <SafeAreaProvider>
      <TimerSettingsProvider>
        <TaskProvider>
          <Navigation />
        </TaskProvider>
      </TimerSettingsProvider>
    </SafeAreaProvider>
  );
}
