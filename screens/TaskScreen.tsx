// src/screens/TaskScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Typography,
  Button,
  Card,
  Input,
  IconButton,
} from "../components/common";
import {
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronLeft,
} from "lucide-react-native";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/task";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const TaskScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskDuration, setTaskDuration] = useState("25");

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Error", "Task title cannot be empty");
      return;
    }

    const duration = parseInt(taskDuration, 10) || 25;

    await addTask({
      title: newTaskTitle.trim(),
      priority: "medium",
      status: "pending",
      duration: duration, // Add the required duration field
      category: "Default", // Optional: Add default category if needed
    });

    setNewTaskTitle("");
    setTaskDuration("25"); // Reset to default
    setIsAddingTask(false);
  };

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const renderTask = (task: Task) => (
    <Card
      key={task.id}
      className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Button
            onPress={() =>
              updateTask(task.id, {
                status: task.status === "completed" ? "pending" : "completed",
              })
            }
            variant="ghost"
            className="p-2"
          >
            {task.status === "completed" ? (
              <CheckCircle2 size={24} color="#10B981" />
            ) : (
              <Circle size={24} color="#6B7280" />
            )}
          </Button>
          <View className="flex-1 ml-3">
            <Typography
              className={`${
                task.status === "completed"
                  ? "text-gray-500 line-through"
                  : "text-white"
              }`}
            >
              {task.title}
            </Typography>
            <View className="flex-row items-center mt-1">
              <Clock size={12} color="#6B7280" />
              <Typography className="text-gray-500 text-xs ml-1">
                {task.focusSessionsSpent} sessions
              </Typography>
            </View>
          </View>
        </View>
        <View
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        />
      </View>
    </Card>
  );

  return (
    <View className="flex-1 bg-[#121212]" style={{ paddingTop: insets.top }}>
      {/* Enhanced Header with Back Button */}
      <View className="px-6 py-4 flex-row items-center">
        <IconButton
          icon={<ChevronLeft size={24} color="#fff" />}
          onPress={() => navigation.goBack()}
          variant="ghost"
          className="mr-3"
        />
        <Typography variant="h1" className="text-white flex-1">
          Tasks
        </Typography>
      </View>

      {/* Add Task Input */}
      {isAddingTask ? (
        <View className="px-6 mb-4">
          <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A]">
            <Input
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholder="What do you want to focus on?"
              className="text-white mb-3"
              autoFocus
              returnKeyType="next"
            />
            <View className="flex-row items-center mb-3">
              <Clock size={16} color="#6B7280" />
              <Input
                value={taskDuration}
                onChangeText={setTaskDuration}
                placeholder="Duration (minutes)"
                keyboardType="numeric"
                className="text-white ml-2 flex-1"
                maxLength={3}
              />
            </View>
            <View className="flex-row justify-end">
              <Button
                title="Cancel"
                onPress={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle("");
                  setTaskDuration("25");
                }}
                variant="ghost"
                className="mr-2"
              />
              <Button
                title="Add Task"
                onPress={handleAddTask}
                variant="primary"
              />
            </View>
          </Card>
        </View>
      ) : (
        <Button
          title="Add Task"
          onPress={() => setIsAddingTask(true)}
          variant="ghost"
          className="mx-6 mb-4"
          icon={<Plus size={20} color="#3B82F6" />}
        />
      )}

      {/* Tasks List */}
      <ScrollView className="flex-1 px-6">
        {tasks.length === 0 ? (
          <View className="items-center justify-center py-8">
            <AlertCircle size={48} color="#6B7280" />
            <Typography className="text-gray-500 mt-4">
              No tasks yet. Add one to get started!
            </Typography>
          </View>
        ) : (
          tasks.map(renderTask)
        )}
      </ScrollView>
    </View>
  );
};
