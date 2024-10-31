// src/navigation/index.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TimerScreen } from "../screens/TimerScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { BlockedAppsScreen } from "../screens/BlockedAppsScreen";
import { TimerSettingsScreen } from "../screens/TimerSettingsScreen";
import { RootStackParamList } from "../types/navigation";
import { navigationRef } from '../services/navigationService';
import { screenTransitions } from './transitions';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#121212' },
          animation: 'fade_from_bottom',
          ...screenTransitions,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="BlockedApps"
          component={BlockedAppsScreen}
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="TimerSettings"
          component={TimerSettingsScreen}
          options={{
            headerShown: false,
            animation: 'slide_from_bottom',
            gestureEnabled: true,
            gestureDirection: 'vertical',
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            animation: 'fade_from_bottom',
            gestureEnabled: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
