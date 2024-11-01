// src/screens/TimerSettingsScreen.tsx
import React from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Button,
  IconButton,
  Card
} from '../components/common';
import {
  ChevronLeft,
  Clock,
  Bell,
  Vibrate,
  Moon
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { useTimerSettings } from '../context/TimerSettingsContext';
import * as Haptics from 'expo-haptics';

export const TimerSettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { settings, updateSettings } = useTimerSettings();

  const handleSliderChange = async (
    value: number,
    setting: 'focusDuration' | 'shortBreakDuration' | 'longBreakDuration'
  ) => {
    await Haptics.selectionAsync();
    updateSettings({ [setting]: value });
  };

  const handleToggle = async (
    value: boolean,
    setting: 'soundEnabled' | 'vibrationEnabled'
  ) => {
    await Haptics.selectionAsync();
    updateSettings({ [setting]: value });
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
          variant="dark"
        />
        <Typography variant="h2" weight="bold" className="text-white ml-4">
          Timer Settings
        </Typography>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Focus Duration */}
        <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A] mb-6">
          <View className="flex-row items-center mb-6">
            <View className="bg-blue-900/20 p-3 rounded-xl mr-3">
              <Clock size={24} color="#3B82F6" />
            </View>
            <View>
              <Typography weight="semibold" className="text-white text-lg mb-1">
                Focus Duration
              </Typography>
              <Typography className="text-gray-400">
                {settings.focusDuration} minutes
              </Typography>
            </View>
          </View>

          <Slider
            value={settings.focusDuration}
            onValueChange={value => handleSliderChange(value, 'focusDuration')}
            minimumValue={15}
            maximumValue={60}
            step={5}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#2A2A2A"
            thumbTintColor="#3B82F6"
          />

          <View className="flex-row justify-between mt-2">
            <Typography className="text-gray-400">15m</Typography>
            <Typography className="text-gray-400">60m</Typography>
          </View>
        </Card>

        {/* Break Durations */}
        <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A] mb-6">
          <View className="flex-row items-center mb-6">
            <View className="bg-green-900/20 p-3 rounded-xl mr-3">
              <Moon size={24} color="#22C55E" />
            </View>
            <View>
              <Typography weight="semibold" className="text-white text-lg mb-1">
                Break Duration
              </Typography>
              <Typography className="text-gray-400">
                Short: {settings.shortBreakDuration}m, Long: {settings.longBreakDuration}m
              </Typography>
            </View>
          </View>

          <Typography className="text-gray-400 mb-4">Short Break</Typography>
          <Slider
            value={settings.shortBreakDuration}
            onValueChange={value => handleSliderChange(value, 'shortBreakDuration')}
            minimumValue={3}
            maximumValue={15}
            step={1}
            minimumTrackTintColor="#22C55E"
            maximumTrackTintColor="#2A2A2A"
            thumbTintColor="#22C55E"
            className="mb-6"
          />

          <Typography className="text-gray-400 mb-4">Long Break</Typography>
          <Slider
            value={settings.longBreakDuration}
            onValueChange={value => handleSliderChange(value, 'longBreakDuration')}
            minimumValue={15}
            maximumValue={30}
            step={5}
            minimumTrackTintColor="#22C55E"
            maximumTrackTintColor="#2A2A2A"
            thumbTintColor="#22C55E"
          />
        </Card>

        {/* Notifications */}
        <Card className="bg-[#1E1E1E] p-6 rounded-2xl border border-[#2A2A2A] mb-6">
          <View className="space-y-6">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="bg-purple-900/20 p-3 rounded-xl mr-3">
                  <Bell size={24} color="#A855F7" />
                </View>
                <Typography className="text-white">Sound Alerts</Typography>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={value => handleToggle(value, 'soundEnabled')}
                trackColor={{ false: '#2A2A2A', true: '#A855F7' }}
                thumbColor="#fff"
              />
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center">
                <View className="bg-orange-900/20 p-3 rounded-xl mr-3">
                  <Vibrate size={24} color="#F97316" />
                </View>
                <Typography className="text-white">Vibration</Typography>
              </View>
              <Switch
                value={settings.vibrationEnabled}
                onValueChange={value => handleToggle(value, 'vibrationEnabled')}
                trackColor={{ false: '#2A2A2A', true: '#F97316' }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};