// src/screens/TaskScreen.tsx
import React, { useState } from "react";
import { View, ScrollView, Alert, Pressable } from "react-native";
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
  Timer
} from "lucide-react-native";
import { useTasks } from "../hooks/useTasks";
import { Task } from "../types/task";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


interface DurationPreset {
  label: string;
  minutes: number;
}

const DURATION_PRESETS: DurationPreset[] = [
  { label: '25min', minutes: 25 },
  { label: '45min', minutes: 45 },
  { label: '60min', minutes: 60 },
];

export const TaskScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<number>(25);
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [customDuration, setCustomDuration] = useState('');


  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#EF4444';  // red
      case 'medium':
        return '#F59E0B';  // amber
      case 'low':
        return '#10B981';  // green
      default:
        return '#6B7280';  // gray
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert('Error', 'Task title cannot be empty');
      return;
    }

    const duration = isCustomDuration
      ? (parseInt(customDuration, 10) || 25)
      : selectedDuration;

    // Validate duration
    if (duration < 1 || duration > 180) {
      Alert.alert('Invalid Duration', 'Please enter a duration between 1 and 180 minutes');
      return;
    }

    try {
      await addTask({
        title: newTaskTitle.trim(),
        priority: 'medium',
        status: 'pending',
        duration: duration,
        category: 'Default'
      });

      // Reset form
      setNewTaskTitle('');
      setSelectedDuration(25);
      setIsCustomDuration(false);
      setCustomDuration('');
      setIsAddingTask(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to add task. Please try again.');
    }
  };

  const handleDurationSelect = (minutes: number) => {
    setSelectedDuration(minutes);
    setIsCustomDuration(false);
  };

  const handleCustomDurationChange = (value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    setCustomDuration(numericValue);
    setIsCustomDuration(true);
  };

  const DurationSelector = () => (
    <View className="mb-4">
      <Typography className="text-gray-400 mb-2">Session Duration</Typography>
      <View className="flex-row space-x-2 mb-2">
        {DURATION_PRESETS.map((preset) => (
          <Pressable
            key={preset.minutes}
            onPress={() => handleDurationSelect(preset.minutes)}
            className={`flex-1 p-3 rounded-xl border ${
              selectedDuration === preset.minutes && !isCustomDuration
                ? 'border-blue-500 bg-blue-500/20'
                : 'border-[#2A2A2A] bg-[#2A2A2A]'
            }`}
          >
            <View className="items-center">
              <Timer
                size={16}
                color={selectedDuration === preset.minutes && !isCustomDuration ? '#3B82F6' : '#6B7280'}
              />
              <Typography
                className={`mt-1 ${
                  selectedDuration === preset.minutes && !isCustomDuration
                    ? 'text-blue-500'
                    : 'text-gray-400'
                }`}
              >
                {preset.label}
              </Typography>
            </View>
          </Pressable>
        ))}
      </View>
      <View className="flex-row items-center">
        <Input
          value={isCustomDuration ? customDuration : ''}
          onChangeText={handleCustomDurationChange}
          placeholder="Custom duration"
          keyboardType="numeric"
          className={`flex-1 ${
            isCustomDuration ? 'text-blue-500' : 'text-white'
          }`}
          maxLength={3}
        />
        <Typography className="text-gray-400 ml-2">minutes</Typography>
      </View>
    </View>
  );

  const renderTask = (task: Task) => {
    const isCompleted = task.status === 'completed';

    return (
      <Card
        key={task.id}
        className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Button
              onPress={() => updateTask(task.id, {
                status: isCompleted ? 'pending' : 'completed'
              })}
              variant="ghost"
              className="p-2"
            >
              {isCompleted ? (
                <CheckCircle2 size={24} color="#10B981" />
              ) : (
                <Circle size={24} color="#6B7280" />
              )}
            </Button>
            <View className="flex-1 ml-3">
              <Typography
                className={`${
                  isCompleted ? 'text-gray-500 line-through' : 'text-white'
                }`}
              >
                {task.title}
              </Typography>
              <View className="flex-row items-center mt-1 space-x-2">
                <View className="flex-row items-center">
                  <Clock size={12} color="#6B7280" />
                  <Typography className="text-gray-500 text-xs ml-1">
                    {task.duration}min
                  </Typography>
                </View>
                {task.focusSessionsSpent > 0 && (
                  <View className="flex-row items-center">
                    <Timer size={12} color="#6B7280" />
                    <Typography className="text-gray-500 text-xs ml-1">
                      {task.focusSessionsSpent} sessions
                    </Typography>
                  </View>
                )}
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
  };

  return (
    <View
      className="flex-1 bg-[#121212]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
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
              className="text-white mb-4"
              autoFocus
            />

            <DurationSelector />

            <View className="flex-row justify-end mt-2">
              <Button
                title="Cancel"
                onPress={() => {
                  setIsAddingTask(false);
                  setNewTaskTitle('');
                  setSelectedDuration(25);
                  setIsCustomDuration(false);
                  setCustomDuration('');
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
            <Typography className="text-gray-500 mt-4 text-center">
              No tasks yet. Add one to get started!
            </Typography>
          </View>
        ) : (
          <View>
            {tasks.map((task) => (
              <View key={task.id}>
                {renderTask(task)}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};