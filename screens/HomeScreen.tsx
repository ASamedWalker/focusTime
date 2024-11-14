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
import { Task } from "../types/task";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { getTodayStats } = useStatistics();
  const { tasks } = useTask();
  const todayStats = getTodayStats();


  const handleTaskPress = (task: Task) => {
    navigation.navigate('Timer', {
      task: {
        id: task.id,
        title: task.title,
        duration: task.duration
      }
    });
  };

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
        {/* Progress Section And Task Preview*/}
        <View className="px-6 py-2">
          <TimeContextWidget className="mb-4" />
        </View>
        <View className="px-6">
          <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-4">
            <Button
              title="Start Focus Session"
              icon={<Play size={20} color="#fff" />}
              variant="primary"
              onPress={() => navigation.navigate("Timer")}
              className="bg-blue-600 h-14"
            />
          </Card>
        </View>

        {/* Progress Section */}
        <View className="px-6">
          <ProgressSection
            stats={{
              todayMinutes: 120,
              completedTasks: 3,
              totalTasks: 5,
              streak: 4,
            }}
            onPress={() => navigation.navigate("Stats")}
          />
        </View>

        <View className="px-6">
          <TasksPreview
            tasks={pendingTasks}
            onTaskPress={handleTaskPress}
            onViewAll={() => navigation.navigate("Tasks")}
          />
        </View>
      </ScrollView>
    </View>
  );
};
