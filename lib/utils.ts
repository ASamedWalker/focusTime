// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// src/utils/taskUtils.ts
import { Task } from '../types/task';

interface PriorityConfig {
  color: string;
  label: string;
}

export const PRIORITY_CONFIG: Record<Task['priority'], PriorityConfig> = {
  high: {
    color: '#EF4444',
    label: 'High Priority'
  },
  medium: {
    color: '#F59E0B',
    label: 'Medium Priority'
  },
  low: {
    color: '#10B981',
    label: 'Low Priority'
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  return PRIORITY_CONFIG[priority]?.color ?? '#6B7280';
};

export const getPriorityLabel = (priority: Task['priority']): string => {
  return PRIORITY_CONFIG[priority]?.label ?? 'No Priority';
};