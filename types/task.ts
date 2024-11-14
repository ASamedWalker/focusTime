// src/types/task.ts
export interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  duration: number;
  focusSessionsSpent: number;
  createdAt: Date;
  completedAt?: Date;
  category?: string;
}