// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

const TASKS_STORAGE_KEY = '@FocusTime:tasks';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'focusSessionsSpent'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: Date.now(),
      focusSessionsSpent: 0,
      status: 'pending'
    };
    await saveTasks([...tasks, newTask]);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    await saveTasks(updatedTasks);
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(updatedTasks);
  };

  const incrementFocusSession = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, focusSessionsSpent: task.focusSessionsSpent + 1 }
        : task
    );
    await saveTasks(updatedTasks);
  };

  return {
    tasks,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    incrementFocusSession
  };
};