// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: number;
  completedAt?: number;
  focusSessionsSpent: number;
}