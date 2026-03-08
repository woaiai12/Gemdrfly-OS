import { Goal, Task, ProgressStats } from "./types";

// 演示模式数据
export const mockUser = {
  uid: "demo-user-123",
  email: "demo@gemdrfly-os.com",
  createdAt: new Date(),
};

export const mockGoals: Goal[] = [
  {
    id: "goal-1",
    userId: "demo-user-123",
    title: "学习AI产品经理",
    dailyTime: 30,
    category: "学习",
    createdAt: new Date(),
    status: "active",
  },
  {
    id: "goal-2",
    userId: "demo-user-123",
    title: "每日健身",
    dailyTime: 20,
    category: "健身",
    createdAt: new Date(),
    status: "active",
  },
  {
    id: "goal-3",
    userId: "demo-user-123",
    title: "写作练习",
    dailyTime: 15,
    category: "写作",
    createdAt: new Date(),
    status: "paused",
  },
];

export const mockTasks: Task[] = [
  {
    id: "task-1",
    goalId: "goal-1",
    userId: "demo-user-123",
    date: new Date(),
    content: "学习AI产品经理",
    duration: 30,
    completed: false,
  },
  {
    id: "task-2",
    goalId: "goal-2",
    userId: "demo-user-123",
    date: new Date(),
    content: "每日健身",
    duration: 20,
    completed: false,
  },
];

export const mockProgressStats: ProgressStats = {
  currentStreak: 7,
  longestStreak: 15,
  totalTasks: 42,
  totalGoals: 3,
  activeGoals: 2,
  goalProgress: [
    {
      goalId: "goal-1",
      goalTitle: "学习AI产品经理",
      completedTasks: 15,
      totalTasks: 20,
      progress: 75,
    },
    {
      goalId: "goal-2",
      goalTitle: "每日健身",
      completedTasks: 20,
      totalTasks: 25,
      progress: 80,
    },
    {
      goalId: "goal-3",
      goalTitle: "写作练习",
      completedTasks: 7,
      totalTasks: 10,
      progress: 70,
    },
  ],
};

// 演示模式的Firestore操作
export const mockFirestore = {
  getUserGoals: async (): Promise<Goal[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockGoals), 500);
    });
  },

  createGoal: async (
    userId: string,
    title: string,
    dailyTime: number,
    category: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const newGoal: Goal = {
        id: `goal-${Date.now()}`,
        userId,
        title,
        dailyTime,
        category,
        createdAt: new Date(),
        status: "active",
      };
      mockGoals.push(newGoal);
      setTimeout(() => resolve(newGoal.id), 500);
    });
  },

  getTodayTasks: async (): Promise<Task[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockTasks), 500);
    });
  },

  toggleTaskCompletion: async (taskId: string): Promise<void> => {
    return new Promise((resolve) => {
      const task = mockTasks.find((t) => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        if (task.completed) {
          task.completedAt = new Date();
        }
      }
      setTimeout(() => resolve(), 500);
    });
  },

  getUserProgressStats: async (): Promise<ProgressStats> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockProgressStats), 500);
    });
  },

  updateGoalStatus: async (goalId: string, status: string): Promise<void> => {
    return new Promise((resolve) => {
      const goal = mockGoals.find((g) => g.id === goalId);
      if (goal) {
        goal.status = status as any;
      }
      setTimeout(() => resolve(), 500);
    });
  },

  deleteGoal: async (goalId: string): Promise<void> => {
    return new Promise((resolve) => {
      const index = mockGoals.findIndex((g) => g.id === goalId);
      if (index > -1) {
        mockGoals.splice(index, 1);
      }
      setTimeout(() => resolve(), 500);
    });
  },
};
