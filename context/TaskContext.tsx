// src/context/TaskContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  activeTask?: Task;
  setActiveTask: (task: Task | undefined) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'focusSessionsSpent'>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  incrementFocusSession: (taskId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem('@FocusTime:tasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('@FocusTime:tasks', JSON.stringify(updatedTasks));
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
    };
    await saveTasks([...tasks, newTask]);
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    await saveTasks(updatedTasks);

    // Update active task if it's being updated
    if (activeTask?.id === taskId) {
      setActiveTask({ ...activeTask, ...updates });
    }
  };

  const deleteTask = async (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await saveTasks(updatedTasks);

    // Clear active task if it's being deleted
    if (activeTask?.id === taskId) {
      setActiveTask(undefined);
    }
  };

  const incrementFocusSession = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, focusSessionsSpent: task.focusSessionsSpent + 1 }
        : task
    );
    await saveTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        activeTask,
        setActiveTask,
        addTask,
        updateTask,
        deleteTask,
        incrementFocusSession,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};