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
} from "../components/common";
import TimeContextWidget from "../components/Widget/TimeContextWidget";
import ProgressSection from "../components/Progress/ProgressSection";
import TasksPreview from "../components/task/TasksPreview";
import {
  Play,
  ListTodo,
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
  const { getTodayStats } = useStatistics();
  const { tasks } = useTask();
  const todayStats = getTodayStats();

  const completedTodayCount = tasks.filter(
    (task) =>
      task.status === "completed" &&
      new Date(task.completedAt!).toDateString() === new Date().toDateString()
  ).length;

  const pendingTasks = tasks.filter((task) => task.status === "pending");

  return (
    <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
      {/* Header with Logo and Actions */}
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
        {/* Time Context Section */}
        {/* <View className="px-6 py-2">
          <TimeContextWidget className="mb-4" />


        </View> */}

        {/* Today's Progress - Enhanced spacing */}
        {/* <View className="px-6 py-4 mt-2">
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
            <Card className="flex-1 p-4 bg-[#1E1E1E] rounded-xl border border-[#2A2A2A]">
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
        </View> */}

        {/* Pending Tasks - Improved spacing */}
        {/* <View className="px-6 pb-6">
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
        </View> */}

        {/* Progress Section And Task Preview*/}
        <View className="px-6 space-y-4">
          <TimeContextWidget className="mb-4"/>
          {/* Start Focus Button - Now more prominent */}
          <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-4">
            <Button
              title="Start Focus Session"
              icon={<Play size={20} color="#fff" />}
              variant="primary"
              onPress={() => navigation.navigate("Timer")}
              className="bg-blue-600 h-14"
            />
          </Card>
          <ProgressSection
            stats={{
              todayMinutes: 120,
              completedTasks: 3,
              totalTasks: 5,
              streak: 4,
            }}
            onPress={() => navigation.navigate("Stats")}
          />
          <TasksPreview
            tasks={pendingTasks}
            onTaskPress={(task) => handleTaskPress(task)}
            onViewAll={() => navigation.navigate("Tasks")}
          />
        </View>
      </ScrollView>
    </View>
  );
};
