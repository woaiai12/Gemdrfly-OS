// 用户类型
export interface User {
  uid: string;
  email: string | null;
  displayName?: string | null;
  createdAt: Date;
}

// 目标类型
export interface Goal {
  id: string;
  userId: string;
  title: string;
  dailyTime: number; // 每日投入时间（分钟）
  category: string; // 目标类别：学习、健身、写作等
  createdAt: Date;
  status: 'active' | 'paused' | 'completed';
}

// 任务类型
export interface Task {
  id: string;
  goalId: string;
  userId: string;
  date: Date; // 任务日期
  content: string; // 任务内容
  duration: number; // 预计时长（分钟）
  completed: boolean;
  completedAt?: Date;
}

// 完成记录类型
export interface Completion {
  id: string;
  userId: string;
  taskId: string;
  goalId: string;
  completedAt: Date;
}

// 成长统计类型
export interface ProgressStats {
  currentStreak: number; // 当前连续天数
  longestStreak: number; // 最长连续天数
  totalTasks: number; // 累计完成任务数
  totalGoals: number; // 总目标数
  activeGoals: number; // 活跃目标数
  goalProgress: Array<{
    goalId: string;
    goalTitle: string;
    completedTasks: number;
    totalTasks: number;
    progress: number; // 百分比
  }>;
}

// AI引导语类型
export interface GuidanceMessage {
  id: string;
  category: string; // 类别：学习、健身、写作、通用
  type: 'start' | 'motivation' | 'achievement' | 'reminder';
  message: string;
}
