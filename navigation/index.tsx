// src/navigation/index.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/HomeScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TimerScreen } from "../screens/TimerScreen";
import { StatsScreen } from "../screens/StatsScreen";
import { BlockedAppsScreen } from "../screens/BlockedAppsScreen";
import { RootStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "#121212",
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Timer"
          component={TimerScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="BlockedApps"
          component={BlockedAppsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
