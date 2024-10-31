// src/screens/BlockedAppsScreen.tsx
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Button,
  IconButton,
  Card,
  Input
} from '../components/common';
import {
  ChevronLeft,
  Search,
  Shield,
  Smartphone
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/navigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AppInfo {
  id: string;
  name: string;
  isBlocked: boolean;
}

const MOCK_APPS: AppInfo[] = [
  { id: '1', name: 'Instagram', isBlocked: false },
  { id: '2', name: 'Facebook', isBlocked: false },
  { id: '3', name: 'TikTok', isBlocked: false },
  { id: '4', name: 'Twitter', isBlocked: false },
  { id: '5', name: 'YouTube', isBlocked: false },
  { id: '6', name: 'WhatsApp', isBlocked: false },
];

export const BlockedAppsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<AppInfo[]>(MOCK_APPS);

  const toggleAppBlock = (appId: string) => {
    setApps(prevApps =>
      prevApps.map(app =>
        app.id === appId
          ? { ...app, isBlocked: !app.isBlocked }
          : app
      )
    );
  };

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const blockedAppsCount = apps.filter(app => app.isBlocked).length;

  const renderAppItem = (app: AppInfo) => (
    <Card
      key={app.id}
      className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A] mb-3"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="bg-[#2A2A2A] p-2 rounded-lg mr-3">
            <Smartphone size={24} color="#3B82F6" />
          </View>
          <View className="flex-1">
            <Typography className="text-white font-medium">
              {app.name}
            </Typography>
          </View>
        </View>
        <Button
          variant={app.isBlocked ? 'primary' : 'outline'}
          title={app.isBlocked ? 'Blocked' : 'Block'}
          onPress={() => toggleAppBlock(app.id)}
          className={`
            px-6 h-11 justify-center items-center
            ${app.isBlocked
              ? 'bg-blue-600'
              : 'border border-[#2A2A2A] bg-[#2A2A2A]'
            }
          `}
          textClassName="text-white text-sm"
        />
      </View>
    </Card>
  );

  return (
    <View
      className="flex-1 bg-[#121212]"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="px-6 py-4 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <IconButton
            icon={<ChevronLeft size={24} color="#fff" />}
            onPress={() => navigation.goBack()}
            variant="dark"
          />
          <Typography variant="h2" weight="bold" className="text-white ml-4">
            Block Apps
          </Typography>
        </View>
        <View className="bg-blue-900/20 px-3 py-1 rounded-full flex-row items-center">
          <Shield size={14} color="#3B82F6" />
          <Typography className="text-white ml-2">
            {blockedAppsCount}
          </Typography>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-6 mb-4">
        <Card className="bg-[#1E1E1E] p-4 rounded-xl border border-[#2A2A2A]">
          <View className="flex-row items-center">
            <Search size={20} color="#64748B" />
            <Input
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search apps..."
              className="flex-1 ml-3 text-white"
            />
          </View>
        </Card>
      </View>

      {/* Apps List */}
      <ScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
      >
        {filteredApps.map(renderAppItem)}
      </ScrollView>
    </View>
  );
};