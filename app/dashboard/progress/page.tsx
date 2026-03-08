"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Progress, List, Empty, Spin } from "antd";
import {
  TrophyOutlined,
  FireOutlined,
  CheckCircleOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { getUserProgressStats } from "@/lib/firestore";
import { ProgressStats } from "@/lib/types";
import { mockProgressStats } from "@/lib/mockData";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function ProgressPage() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadStats();
    }
  }, [currentUser]);

  const loadStats = async () => {
    if (isDemoMode) {
      // 演示模式：使用模拟数据
      setStats(mockProgressStats);
      setLoading(false);
      return;
    }

    // 正常模式：使用Firebase
    try {
      const timeoutId = setTimeout(() => {
        console.warn("统计数据加载超时");
        setStats({
          currentStreak: 0,
          longestStreak: 0,
          totalTasks: 0,
          totalGoals: 0,
          activeGoals: 0,
          goalProgress: []
        });
        setLoading(false);
      }, 8000);

      const userStats = await getUserProgressStats(currentUser!.uid);

      clearTimeout(timeoutId);
      setStats(userStats);
    } catch (error) {
      console.error("加载统计数据失败:", error);
      setStats({
        currentStreak: 0,
        longestStreak: 0,
        totalTasks: 0,
        totalGoals: 0,
        activeGoals: 0,
        goalProgress: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats) {
    return <Empty description="无法加载统计数据" />;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">成长进度</h2>

      {/* 统计卡片 */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="当前连续天数"
              value={stats.currentStreak}
              suffix="天"
              prefix={<FireOutlined />}
              valueStyle={{ color: "#ff4d4f" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="最长连续天数"
              value={stats.longestStreak}
              suffix="天"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="累计完成任务"
              value={stats.totalTasks}
              suffix="个"
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="活跃目标"
              value={stats.activeGoals}
              suffix="个"
              prefix={<AimOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>

      {/* 目标进度 */}
      <Card title="目标完成进度" className="mt-6">
        {stats.goalProgress.length === 0 ? (
          <Empty description="暂无目标数据" />
        ) : (
          <List
            dataSource={stats.goalProgress}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium">
                        {item.goalTitle}
                      </span>
                      <span className="text-gray-600">
                        {item.completedTasks} / {item.totalTasks} 个任务
                      </span>
                    </div>
                  }
                  description={
                    <Progress
                      percent={item.progress}
                      status={
                        item.progress === 100 ? "success" : "active"
                      }
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      }}
                    />
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Card>

      {/* 成就徽章 */}
      <Card title="成就徽章" className="mt-6">
        <Row gutter={[16, 16]}>
          {stats.currentStreak >= 7 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">🔥</div>
                <div className="font-medium">7天连续</div>
              </Card>
            </Col>
          )}
          {stats.currentStreak >= 30 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">💎</div>
                <div className="font-medium">30天连续</div>
              </Card>
            </Col>
          )}
          {stats.currentStreak >= 100 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">👑</div>
                <div className="font-medium">100天连续</div>
              </Card>
            </Col>
          )}
          {stats.totalTasks >= 10 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">⭐</div>
                <div className="font-medium">完成10个任务</div>
              </Card>
            </Col>
          )}
          {stats.totalTasks >= 50 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">🌟</div>
                <div className="font-medium">完成50个任务</div>
              </Card>
            </Col>
          )}
          {stats.totalTasks >= 100 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">🏆</div>
                <div className="font-medium">完成100个任务</div>
              </Card>
            </Col>
          )}
          {stats.goalProgress.some((g) => g.progress === 100) && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <div className="font-medium">达成一个目标</div>
              </Card>
            </Col>
          )}
          {stats.goalProgress.filter((g) => g.progress === 100).length >= 3 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">🏅</div>
                <div className="font-medium">达成三个目标</div>
              </Card>
            </Col>
          )}
          {stats.goalProgress.filter((g) => g.progress === 100).length >= 5 && (
            <Col xs={12} sm={8} md={6}>
              <Card className="text-center">
                <div className="text-4xl mb-2">🎖️</div>
                <div className="font-medium">达成五个目标</div>
              </Card>
            </Col>
          )}
        </Row>
        {stats.currentStreak < 7 && stats.totalTasks < 10 && (
          <Empty description="继续努力，解锁成就徽章！" />
        )}
      </Card>
    </div>
  );
}
