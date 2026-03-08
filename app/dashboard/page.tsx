"use client";

import { useEffect, useState } from "react";
import { Card, List, Button, Empty, Spin, message, Progress } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { getTodayTasks, generateDailyTasks, toggleTaskCompletion } from "@/lib/firestore";
import { getStartGuidance } from "@/lib/guidance";
import { Task } from "@/lib/types";
import { getUserProgressStats } from "@/lib/firestore";
import { mockFirestore, mockTasks, mockProgressStats } from "@/lib/mockData";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [guidance, setGuidance] = useState("");
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    if (currentUser) {
      loadTasks();
      loadStats();
    }
  }, [currentUser]);

  const loadTasks = async () => {
    if (isDemoMode) {
      // 演示模式：使用模拟数据
      setTasks(mockTasks);
      const msg = getStartGuidance("通用", 7);
      setGuidance(msg);
      setCurrentStreak(7);
      setLoading(false);
      return;
    }

    // 正常模式：使用Firebase
    try {
      // 添加超时保护
      const timeoutId = setTimeout(() => {
        console.warn("数据加载超时，显示空列表");
        setTasks([]);
        setLoading(false);
      }, 8000);

      await generateDailyTasks(currentUser!.uid);
      const todayTasks = await getTodayTasks(currentUser!.uid);

      clearTimeout(timeoutId);
      setTasks(todayTasks);

      const category = "通用";
      const msg = getStartGuidance(category, currentStreak);
      setGuidance(msg);
    } catch (error: any) {
      console.error("加载任务失败:", error);
      message.error("加载任务失败: " + (error.message || "未知错误"));
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    if (isDemoMode) {
      // 演示模式：使用模拟数据
      setCurrentStreak(mockProgressStats.currentStreak);
      return;
    }

    // 正常模式：使用Firebase
    try {
      const timeoutId = setTimeout(() => {
        console.warn("统计数据加载超时");
        setCurrentStreak(0);
      }, 6000);

      const stats = await getUserProgressStats(currentUser!.uid);

      clearTimeout(timeoutId);
      setCurrentStreak(stats.currentStreak);
    } catch (error: any) {
      console.error("加载统计数据失败:", error);
      setCurrentStreak(0);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      if (isDemoMode) {
        // 演示模式：更新本地状态
        await mockFirestore.toggleTaskCompletion(taskId);
        const updatedTasks = mockTasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
      } else {
        // 正常模式：使用Firebase
        await toggleTaskCompletion(taskId, !completed);
        // 乐观更新UI
        const updatedTasks = tasks.map(t =>
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        setTasks(updatedTasks);
        // 后台重新加载数据
        loadTasks();
        loadStats();
      }
      message.success(completed ? "任务已标记为未完成" : "恭喜！任务完成！");
    } catch (error) {
      console.error("更新任务失败:", error);
      message.error("更新任务失败");
      // 失败时重新加载数据
      loadTasks();
      loadStats();
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">今日任务</h2>
        <Progress
          percent={Math.round(progressPercent)}
          status="active"
          strokeColor={{
            "0%": "#108ee9",
            "100%": "#87d068",
          }}
        />
        <p className="text-gray-600 mt-2">
          已完成 {completedCount} / {totalCount} 个任务
        </p>
      </div>

      {guidance && (
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <p className="text-lg font-medium text-blue-900">💡 {guidance}</p>
        </Card>
      )}

      {currentStreak > 0 && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <p className="text-lg font-medium text-green-900">
            🔥 你已经连续坚持了 {currentStreak} 天，继续保持！
          </p>
        </Card>
      )}

      <Card>
        <List
          itemLayout="horizontal"
          dataSource={tasks}
          locale={{
            emptyText: <Empty description="今日暂无任务" />,
          }}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button
                  type={task.completed ? "default" : "primary"}
                  icon={
                    task.completed ? (
                      <CloseCircleOutlined />
                    ) : (
                      <CheckCircleOutlined />
                    )
                  }
                  onClick={() => handleToggleTask(task.id, task.completed)}
                >
                  {task.completed ? "撤销" : "完成"}
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span
                    className={task.completed ? "line-through text-gray-400" : ""}
                  >
                    {task.content}
                  </span>
                }
                description={`预计时长: ${task.duration} 分钟`}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
}
