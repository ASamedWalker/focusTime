// src/screens/HomeScreen.tsx
import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Typography,
  Card,
  Button,
  IconButton,
  Logo,
  StatsDisplay,
} from "../components/common";
import {
  Play,
  Pause,
  Lock,
  Timer,
  Settings,
  History,
  Target,
  BarChart,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useStatistics } from "../hooks/useStatistics";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [isActive, setIsActive] = React.useState(false);
  const { getTodayStats } = useStatistics();
  const todayStats = getTodayStats();

  return (
    <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View>
          <Logo size="lg" />
          <Typography variant="caption" className="text-gray-400">
            Stay productive and focused
          </Typography>
        </View>
        <View className="flex-row space-x-3">
          <IconButton
            icon={<BarChart size={22} color="#fff" />}
            onPress={() => navigation.navigate("Stats")}
            variant="dark"
            className="bg-[#2A2A2A]"
          />
          <IconButton
            icon={<Settings size={22} color="#fff" />}
            onPress={() => navigation.navigate("Settings")}
            variant="dark"
            className="bg-[#2A2A2A]"
          />
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Main Focus Timer Card */}
        <View className="px-6 py-4">
          <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A]">
            <View className="items-center mb-6">
              <Typography
                variant="h1"
                weight="bold"
                className="text-white text-6xl mb-2"
              >
                25:00
              </Typography>
              <Typography className="text-gray-400">Focus Session</Typography>
            </View>

            <Button
              title={isActive ? "Pause" : "Start Focus"}
              icon={
                isActive ? (
                  <Pause size={20} color="#fff" />
                ) : (
                  <Play size={20} color="#fff" />
                )
              }
              onPress={() => navigation.navigate("Timer")}
              className="bg-blue-600 h-14 rounded-xl mb-4"
            />

            <View className="flex-row space-x-5">
              <Button
                title="Block Apps"
                icon={<Lock size={18} color="#fff" />}
                variant="secondary"
                onPress={() => navigation.navigate('BlockedApps')}
                className="flex-1 bg-[#2A2A2A] h-12 mr-2"
              />
              <Button
                title="Timer"
                icon={<Timer size={18} color="#fff" />}
                variant="secondary"
                onPress={() => navigation.navigate('TimerSettings')}
                className="flex-1 bg-[#2A2A2A] h-12 ml-2"
              />
            </View>
          </Card>
        </View>

        {/* Today's Statistics */}
        <View className="px-6 py-2">
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="h3" weight="semibold" className="text-white">
              Today's Progress
            </Typography>
            <Button
              title="See All"
              variant="outline"
              onPress={() => navigation.navigate("Stats")}
              className="h-8 px-3 border-[#2A2A2A]"
              textClassName="text-blue-500"
            />
          </View>

          <StatsDisplay
            totalFocusTime={todayStats.totalFocusTime}
            completedSessions={todayStats.completedSessions}
            streak={todayStats.streak}
          />
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-2">
          <Typography
            variant="h3"
            weight="semibold"
            className="text-white mb-4"
          >
            Today's Progress
          </Typography>
          <View className="flex-row space-x-4">
            <Card className="flex-1 p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] mr-2">
              <View className="items-center">
                <View className="bg-blue-900 p-3 rounded-lg mb-2">
                  <Target size={20} color="#3B82F6" />
                </View>
                <Typography weight="semibold" className="text-white mb-1">
                  2.5 hrs
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Focus Time
                </Typography>
              </View>
            </Card>
            <Card className="flex-1 p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] ml-2">
              <View className="items-center">
                <View className="bg-purple-900 p-3 rounded-lg mb-2">
                  <History size={20} color="#A855F7" />
                </View>
                <Typography weight="semibold" className="text-white mb-1">
                  5 Apps
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Blocked
                </Typography>
              </View>
            </Card>
          </View>
        </View>

        {/* Recent Focus Sessions */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="h3" weight="semibold" className="text-white">
              Recent Sessions
            </Typography>
            <Button
              title="See All"
              variant="outline"
              onPress={() => {}}
              className="h-8 px-3 border-[#2A2A2A]"
              textClassName="text-blue-500"
            />
          </View>

          {[
            { time: "2h 15m", date: "Today, 10:30 AM", apps: 5 },
            { time: "1h 45m", date: "Today, 8:00 AM", apps: 3 },
          ].map((session, index) => (
            <Card
              key={index}
              className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-6"
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Typography weight="semibold" className="text-white mb-1">
                    {session.time}
                  </Typography>
                  <Typography variant="caption" className="text-gray-400">
                    {session.date}
                  </Typography>
                </View>
                <View className="bg-[#2A2A2A] px-3 py-1 rounded-full">
                  <Typography variant="caption" className="text-blue-500">
                    {session.apps} apps blocked
                  </Typography>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
