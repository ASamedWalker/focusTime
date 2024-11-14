// src/components/ProgressSection.tsx
import React from 'react';
import { View, Pressable } from 'react-native';
import { Typography, Card } from '../common';
import { Target, CheckCircle2, Timer, TrendingUp, ChevronRight } from 'lucide-react-native';

interface ProgressMetric {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
  trend?: number;
}

const ProgressSection = ({ stats, onPress }) => {
  const metrics: ProgressMetric[] = [
    {
      icon: <Timer size={20} color="#3B82F6" />,
      value: stats.todayMinutes,
      label: 'Minutes Today',
      color: '#3B82F6',
      trend: 15 // percentage increase
    },
    {
      icon: <Target size={20} color="#22C55E" />,
      value: `${stats.completedTasks}/${stats.totalTasks}`,
      label: 'Tasks Done',
      color: '#22C55E'
    },
    {
      icon: <TrendingUp size={20} color="#F59E0B" />,
      value: stats.streak,
      label: 'Day Streak',
      color: '#F59E0B'
    }
  ];

  return (
    <Pressable onPress={onPress}>
      <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Typography variant="h3" weight="semibold" className="text-white">
            Today's Progress
          </Typography>
          <ChevronRight size={20} color="#6B7280" />
        </View>

        <View className="flex-row justify-between">
          {metrics.map((metric, index) => (
            <View
              key={metric.label}
              className={`flex-1 ${index !== 0 ? 'ml-4' : ''}`}
            >
              <View
                className="p-3 rounded-lg mb-2"
                style={{ backgroundColor: `${metric.color}15` }}
              >
                {metric.icon}
              </View>
              <View className="flex-row items-center">
                <Typography className="text-white text-lg font-semibold">
                  {metric.value}
                </Typography>
                {metric.trend && (
                  <Typography className="text-green-500 text-xs ml-2">
                    +{metric.trend}%
                  </Typography>
                )}
              </View>
              <Typography className="text-gray-400 text-sm">
                {metric.label}
              </Typography>
            </View>
          ))}
        </View>
      </Card>
    </Pressable>
  );
};

export default ProgressSection;