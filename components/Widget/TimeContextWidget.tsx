// src/components/TimeContextWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography, Card } from '../common';
import { Sun, Moon, Sunrise, Sunset, Zap } from 'lucide-react-native';

interface TimeContextWidgetProps {
  className?: string;
}

interface DayPeriod {
  text: string;
  icon: typeof Sun;
  color: string;
  greeting: string;
}

interface FocusWindow {
  type: 'peak' | 'good';
  message: string;
}

const TimeContextWidget: React.FC<TimeContextWidgetProps> = ({ className }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(1));
  const lastPeriodRef = useRef<string | null>(null);
  const lastFocusWindowRef = useRef<string | null>(null);

  const handlePeriodChange = (newPeriod: DayPeriod) => {
    if (lastPeriodRef.current !== newPeriod.text) {
      // Light impact for period changes
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      lastPeriodRef.current = newPeriod.text;
    }
  };

  const handleFocusWindowChange = (newFocusWindow: FocusWindow | null) => {
    const newFocusType = newFocusWindow?.type || 'none';
    if (lastFocusWindowRef.current !== newFocusType) {
      // Medium impact for entering peak focus times
      if (newFocusWindow?.type === 'peak') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Light impact for entering good focus times
      } else if (newFocusWindow?.type === 'good') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      lastFocusWindowRef.current = newFocusType;
    }
  };

  const getDayPeriod = (hour: number): DayPeriod => {
    if (hour >= 5 && hour < 12) {
      return {
        text: 'Morning',
        icon: Sunrise,
        color: '#F59E0B',
        greeting: 'Start Fresh'
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        text: 'Afternoon',
        icon: Sun,
        color: '#3B82F6',
        greeting: 'Stay Focused'
      };
    } else if (hour >= 17 && hour < 21) {
      return {
        text: 'Evening',
        icon: Sunset,
        color: '#8B5CF6',
        greeting: 'Wrap Up'
      };
    } else {
      return {
        text: 'Night',
        icon: Moon,
        color: '#6B7280',
        greeting: 'Wind Down'
      };
    }
  };

  const getFocusWindow = (hour: number): FocusWindow | null => {
    if (hour >= 9 && hour <= 11) {
      return {
        type: 'peak',
        message: 'Peak Focus Time'
      };
    } else if (hour >= 15 && hour <= 17) {
      return {
        type: 'peak',
        message: 'Afternoon Peak'
      };
    } else if ((hour >= 8 && hour < 9) || (hour > 11 && hour < 15)) {
      return {
        type: 'good',
        message: 'Good Focus Time'
      };
    }
    return null;
  };

  useEffect(() => {
    const updateTime = () => {
      const newDate = new Date();
      const newPeriod = getDayPeriod(newDate.getHours());
      const newFocusWindow = getFocusWindow(newDate.getHours());

      // Check for period or focus window changes
      handlePeriodChange(newPeriod);
      handleFocusWindowChange(newFocusWindow);

      // Update time with animation
      Animated.timing(fadeAnim, {
        toValue: 0.7,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setCurrentTime(newDate);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    };

    // Initial update
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, [fadeAnim]);

  const period = getDayPeriod(currentTime.getHours());
  const focusWindow = getFocusWindow(currentTime.getHours());
  const Icon = period.icon;

  return (
    <Card className={`bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] ${className}`}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Typography className="text-white text-3xl font-bold">
              {currentTime.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
              })}
            </Typography>
            <View className="flex-row items-center mt-2 space-x-2">
              <View
                className="flex-row items-center px-3 py-1 rounded-full"
                style={{ backgroundColor: `${period.color}20` }}
              >
                <Icon size={16} color={period.color} />
                <Typography
                  className="ml-2"
                  style={{ color: period.color }}
                >
                  {period.text}
                </Typography>
              </View>

              {focusWindow && (
                <View
                  className={`flex-row items-center px-3 py-1 rounded-full ${
                    focusWindow.type === 'peak' ? 'bg-green-500/20' : 'bg-blue-500/20'
                  }`}
                >
                  <Zap
                    size={16}
                    color={focusWindow.type === 'peak' ? '#22C55E' : '#3B82F6'}
                  />
                  <Typography
                    className="ml-2 text-sm"
                    style={{
                      color: focusWindow.type === 'peak' ? '#22C55E' : '#3B82F6'
                    }}
                  >
                    {focusWindow.message}
                  </Typography>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>
    </Card>
  );
};

export default TimeContextWidget;