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
  ListTodo,
  Timer,
  Settings,
  History,
  Target,
  BarChart,
  CheckCircle2,
} from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { useStatistics } from "../hooks/useStatistics";
import { useTask } from "../context/TaskContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [isActive, setIsActive] = React.useState(false);
  const { getTodayStats } = useStatistics();
  const { tasks, activeTask } = useTask();
  const todayStats = getTodayStats();

  // Get pending tasks for today
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const completedTodayCount = tasks.filter(
    (task) =>
      task.status === "completed" &&
      new Date(task.completedAt!).toDateString() === new Date().toDateString()
  ).length;

  return (
    <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View>
          <Logo size="lg" />
          <Typography variant="caption" className="text-gray-400">
            Focus on what matters
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
        {/* Current Task & Timer */}
        <View className="px-6 py-4">
          <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A]">
            {/* Timer Display */}
            <View className="items-center mb-8">
              <Typography
                variant="display"
                weight="bold"
                className="text-white mb-3 font-bold tracking-tight"
              >
                25:00
              </Typography>
              <Typography className="text-gray-400 uppercase tracking-wide text-sm">
                Focus Session
              </Typography>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-5">
              <Button
                title="Tasks"
                icon={<ListTodo size={18} color="#fff" />}
                variant="secondary"
                onPress={() => navigation.navigate("Tasks")}
                className="flex-1 bg-[#2A2A2A] h-14 text-white font-medium"
              />
              <Button
                title="Start Focus"
                icon={<Play size={18} color="#fff" />}
                variant="primary"
                onPress={() => navigation.navigate("Timer")}
                className="flex-1 bg-blue-600 h-14 ml-3"
              />
            </View>
          </Card>
        </View>

        {/* Today's Progress */}
        <View className="px-6 py-2">
          <Typography
            variant="h3"
            weight="semibold"
            className="text-white mb-4"
          >
            Today's Progress
          </Typography>
          <View className="flex-row space-x-4">
            <Card className="flex-1 p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
              <View className="items-center">
                <View className="bg-blue-900/20 p-3 rounded-lg mb-2">
                  <Target size={20} color="#3B82F6" />
                </View>
                <Typography
                  weight="semibold"
                  className="text-white text-lg mb-1"
                >
                  {todayStats.totalFocusTime}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Hours Focused
                </Typography>
              </View>
            </Card>
            <Card className="flex-1 p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A] ml-3">
              <View className="items-center">
                <View className="bg-green-900/20 p-3 rounded-lg mb-2">
                  <CheckCircle2 size={20} color="#22C55E" />
                </View>
                <Typography
                  weight="semibold"
                  className="text-white text-lg mb-1"
                >
                  {completedTodayCount}
                </Typography>
                <Typography variant="caption" className="text-gray-400">
                  Tasks Complete
                </Typography>
              </View>
            </Card>
          </View>
        </View>

        {/* Pending Tasks */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Typography variant="h3" weight="semibold" className="text-white">
              Up Next
            </Typography>
            <Button
              title="View All"
              variant="ghost"
              onPress={() => navigation.navigate("Tasks")}
              textClassName="text-blue-500"
            />
          </View>

          {pendingTasks.length === 0 ? (
            <Card className="bg-[#1E1E1E] p-6 rounded-xl border border-[#2A2A2A]">
              <View className="items-center">
                <ListTodo size={24} color="#6B7280" />
                <Typography className="text-gray-400 mt-2 text-center">
                  No pending tasks. Add some tasks to get started!
                </Typography>
                <Button
                  title="Add Task"
                  variant="ghost"
                  onPress={() => navigation.navigate("Tasks")}
                  className="mt-4"
                  textClassName="text-blue-500"
                />
              </View>
            </Card>
          ) : (
            pendingTasks.slice(0, 3).map((task) => (
              <Card
                key={task.id}
                className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-3"
              >
                <View className="flex-row items-center">
                  <View className="bg-[#2A2A2A] p-2 rounded-lg mr-3">
                    <ListTodo size={20} color="#3B82F6" />
                  </View>
                  <View className="flex-1">
                    <Typography className="text-white">{task.title}</Typography>
                    <Typography className="text-gray-400 text-sm">
                      {task.focusSessionsSpent} focus sessions
                    </Typography>
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
};
