// src/components/TasksPreview.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography, Card } from '../common';
import { ListTodo, Clock, MoreVertical } from 'lucide-react-native';

interface Task {
  id: string;
  title: string;
  duration: number;
  category?: string;
  priority: 'high' | 'medium' | 'low';
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#22C55E';
    default: return '#6B7280';
  }
};

const TasksPreview = ({ tasks, onTaskPress, onViewAll }) => {
  return (
    <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A]">
      <View className="flex-row justify-between items-center mb-4">
        <Typography variant="h3" weight="semibold" className="text-white">
          Up Next
        </Typography>
        <Pressable
          onPress={onViewAll}
          className="bg-blue-500/10 px-3 py-1 rounded-full"
        >
          <Typography className="text-blue-500 text-sm">
            View All
          </Typography>
        </Pressable>
      </View>

      {tasks.length === 0 ? (
        <View className="items-center py-6">
          <View className="bg-gray-800/50 p-4 rounded-full mb-3">
            <ListTodo size={24} color="#6B7280" />
          </View>
          <Typography className="text-gray-400 text-center mb-2">
            All caught up!
          </Typography>
          <Typography className="text-gray-500 text-sm text-center">
            Add new tasks to start your next focus session
          </Typography>
        </View>
      ) : (
        tasks.slice(0, 3).map((task) => (
          <Pressable
            key={task.id}
            onPress={() => onTaskPress(task)}
          >
            <View className="flex-row items-center py-3 border-b border-[#2A2A2A] last:border-b-0">
              <View
                className="w-2 h-2 rounded-full mr-3"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              />
              <View className="flex-1">
                <Typography className="text-white mb-1">
                  {task.title}
                </Typography>
                <View className="flex-row items-center">
                  <Clock size={14} color="#6B7280" />
                  <Typography className="text-gray-400 text-sm ml-1">
                    {task.duration} min
                  </Typography>
                  {task.category && (
                    <View className="bg-gray-800 px-2 py-0.5 rounded ml-2">
                      <Typography className="text-gray-400 text-xs">
                        {task.category}
                      </Typography>
                    </View>
                  )}
                </View>
              </View>
              <MoreVertical size={16} color="#6B7280" />
            </View>
          </Pressable>
        ))
      )}
    </Card>
  );
};

export default TasksPreview;