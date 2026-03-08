import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { Goal, Task, Completion, ProgressStats } from "./types";
import { format, startOfDay, endOfDay } from "date-fns";

// ==================== 目标操作 ====================

/**
 * 创建目标
 */
export async function createGoal(
  userId: string,
  title: string,
  dailyTime: number,
  category: string
): Promise<string> {
  const goalData = {
    userId,
    title,
    dailyTime,
    category,
    status: "active",
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, "goals"), goalData);
  return docRef.id;
}

/**
 * 获取用户的所有目标
 */
export async function getUserGoals(userId: string): Promise<Goal[]> {
  const q = query(
    collection(db, "goals"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      dailyTime: data.dailyTime,
      category: data.category,
      createdAt: data.createdAt.toDate(),
      status: data.status,
    } as Goal;
  });
}

/**
 * 更新目标状态
 */
export async function updateGoalStatus(
  goalId: string,
  status: "active" | "paused" | "completed"
): Promise<void> {
  await updateDoc(doc(db, "goals", goalId), { status });
}

/**
 * 删除目标
 */
export async function deleteGoal(goalId: string): Promise<void> {
  await deleteDoc(doc(db, "goals", goalId));
}

// ==================== 任务操作 ====================

/**
 * 为目标创建今日任务
 */
export async function createDailyTask(
  goalId: string,
  userId: string,
  content: string,
  duration: number
): Promise<string> {
  const taskData = {
    goalId,
    userId,
    date: Timestamp.now(),
    content,
    duration,
    completed: false,
  };

  const docRef = await addDoc(collection(db, "tasks"), taskData);
  return docRef.id;
}

/**
 * 获取用户今日的所有任务
 */
export async function getTodayTasks(userId: string): Promise<Task[]> {
  const today = new Date();
  const startOfToday = startOfDay(today);
  const endOfToday = endOfDay(today);

  const q = query(
    collection(db, "tasks"),
    where("userId", "==", userId),
    where("date", ">=", Timestamp.fromDate(startOfToday)),
    where("date", "<=", Timestamp.fromDate(endOfToday))
  );

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      goalId: data.goalId,
      userId: data.userId,
      date: data.date.toDate(),
      content: data.content,
      duration: data.duration,
      completed: data.completed,
      completedAt: data.completedAt?.toDate(),
    } as Task;
  });
}

/**
 * 生成今日任务（如果不存在）
 */
export async function generateDailyTasks(userId: string): Promise<void> {
  // 获取用户的所有活跃目标
  const goals = await getUserGoals(userId);
  const activeGoals = goals.filter((goal) => goal.status === "active");

  // 检查今日是否已有任务
  const todayTasks = await getTodayTasks(userId);
  const existingGoalIds = new Set(todayTasks.map((task) => task.goalId));

  // 为没有今日任务的目标创建任务
  for (const goal of activeGoals) {
    if (!existingGoalIds.has(goal.id)) {
      await createDailyTask(
        goal.id,
        userId,
        goal.title,
        goal.dailyTime
      );
    }
  }
}

/**
 * 切换任务完成状态
 */
export async function toggleTaskCompletion(
  taskId: string,
  completed: boolean
): Promise<void> {
  const updateData: any = {
    completed,
  };

  if (completed) {
    updateData.completedAt = Timestamp.now();
  }

  await updateDoc(doc(db, "tasks", taskId), updateData);

  // 如果任务完成，创建完成记录
  if (completed) {
    const taskDoc = await getDoc(doc(db, "tasks", taskId));
    const taskData = taskDoc.data();
    if (taskData) {
      await addDoc(collection(db, "completions"), {
        userId: taskData.userId,
        taskId: taskId,
        goalId: taskData.goalId,
        completedAt: Timestamp.now(),
      });
    }
  }
}

/**
 * 删除任务
 */
export async function deleteTask(taskId: string): Promise<void> {
  await deleteDoc(doc(db, "tasks", taskId));
}

// ==================== 统计操作 ====================

/**
 * 获取用户的成长统计数据
 */
export async function getUserProgressStats(userId: string): Promise<ProgressStats> {
  // 获取所有完成记录
  const completionsQuery = query(
    collection(db, "completions"),
    where("userId", "==", userId),
    orderBy("completedAt", "desc")
  );

  const completionsSnapshot = await getDocs(completionsQuery);
  const completions = completionsSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      completedAt: data.completedAt.toDate(),
      goalId: data.goalId,
    };
  });

  // 计算连续天数
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;

  for (const completion of completions) {
    const completionDate = startOfDay(completion.completedAt);

    if (!lastDate) {
      tempStreak = 1;
      lastDate = completionDate;
    } else {
      const dayDiff = Math.floor(
        (lastDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (dayDiff === 1) {
        tempStreak++;
        lastDate = completionDate;
      } else if (dayDiff === 0) {
        // 同一天，跳过
        continue;
      } else {
        // 断了
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
        tempStreak = 1;
        lastDate = completionDate;
      }
    }
  }

  // 更新最长连续天数
  if (tempStreak > longestStreak) {
    longestStreak = tempStreak;
  }

  // 当前连续天数（从最近一次完成开始算）
  const today = startOfDay(new Date());
  if (completions.length > 0) {
    const lastCompletionDate = startOfDay(completions[0].completedAt);
    const daysSinceLastCompletion = Math.floor(
      (today.getTime() - lastCompletionDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceLastCompletion === 0 || daysSinceLastCompletion === 1) {
      currentStreak = tempStreak;
    } else {
      currentStreak = 0;
    }
  }

  // 获取用户目标
  const goals = await getUserGoals(userId);
  const activeGoals = goals.filter((goal) => goal.status === "active").length;

  // 计算每个目标的进度
  const goalProgress = await Promise.all(
    goals.map(async (goal) => {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("goalId", "==", goal.id)
      );

      const tasksSnapshot = await getDocs(tasksQuery);
      const tasks = tasksSnapshot.docs.map((doc) => doc.data());
      const completedTasks = tasks.filter((task) => task.completed).length;

      return {
        goalId: goal.id,
        goalTitle: goal.title,
        completedTasks,
        totalTasks: tasks.length,
        progress: tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0,
      };
    })
  );

  return {
    currentStreak,
    longestStreak,
    totalTasks: completions.length,
    totalGoals: goals.length,
    activeGoals,
    goalProgress,
  };
}
