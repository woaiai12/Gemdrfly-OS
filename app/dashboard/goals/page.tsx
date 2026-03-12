"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  List,
  Space,
  Modal,
  message,
  Popconfirm,
  Tag,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { Goal } from "@/lib/types";
import {
  getUserGoals,
  createGoal,
  deleteGoal,
  updateGoalStatus,
} from "@/lib/firestore";
import { mockFirestore, mockGoals } from "@/lib/mockData";
import { GoalListSkeleton } from "@/components/skeletons/GoalListSkeleton";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const { Option } = Select;

const categories = [
  { value: "学习", label: "📚 学习" },
  { value: "健身", label: "💪 健身" },
  { value: "写作", label: "✍️ 写作" },
  { value: "工作", label: "💼 工作" },
  { value: "其他", label: "🎯 其他" },
];

export default function GoalsPage() {
  const { currentUser } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadGoals();
    }
  }, [currentUser]);

  const loadGoals = async () => {
    try {
      if (isDemoMode) {
        // 演示模式：使用模拟数据
        setGoals([...mockGoals]);
      } else {
        // 正常模式：使用Firebase
        const userGoals = await getUserGoals(currentUser!.uid);
        setGoals(userGoals);
      }
    } catch (error) {
      console.error("加载目标失败:", error);
      message.error("加载目标失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);
      if (isDemoMode) {
        // 演示模式：使用模拟数据
        await mockFirestore.createGoal(
          currentUser!.uid,
          values.title,
          values.dailyTime,
          values.category
        );
      } else {
        // 正常模式：使用Firebase
        await createGoal(
          currentUser!.uid,
          values.title,
          values.dailyTime,
          values.category
        );
      }
      message.success("目标创建成功！");
      form.resetFields();
      setIsModalVisible(false);
      loadGoals();
    } catch (error) {
      console.error("创建目标失败:", error);
      message.error("创建目标失败");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (goalId: string) => {
    try {
      if (isDemoMode) {
        // 演示模式：使用模拟数据
        await mockFirestore.deleteGoal(goalId);
      } else {
        // 正常模式：使用Firebase
        await deleteGoal(goalId);
      }
      message.success("目标已删除");
      loadGoals();
    } catch (error) {
      console.error("删除目标失败:", error);
      message.error("删除目标失败");
    }
  };

  const handleToggleStatus = async (goalId: string, currentStatus: string) => {
    try {
      const newStatus =
        currentStatus === "active" ? "paused" : "active";
      if (isDemoMode) {
        // 演示模式：使用模拟数据
        await mockFirestore.updateGoalStatus(goalId, newStatus);
      } else {
        // 正常模式：使用Firebase
        await updateGoalStatus(goalId, newStatus as any);
      }
      message.success(
        newStatus === "active" ? "目标已激活" : "目标已暂停"
      );
      loadGoals();
    } catch (error) {
      console.error("更新目标状态失败:", error);
      message.error("更新目标状态失败");
    }
  };

  const getStatusTag = (status: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
      active: { color: "green", text: "进行中" },
      paused: { color: "orange", text: "已暂停" },
      completed: { color: "blue", text: "已完成" },
    };
    const { color, text } = statusMap[status] || statusMap.active;
    return <Tag color={color}>{text}</Tag>;
  };

  if (loading) {
    return <GoalListSkeleton />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">我的目标</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          创建目标
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <Empty
            description="还没有创建任何目标"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={goals}
          renderItem={(goal) => (
            <List.Item>
              <Card
                actions={[
                  goal.status === "active" ? (
                    <Button
                      icon={<PauseCircleOutlined />}
                      onClick={() => handleToggleStatus(goal.id, goal.status)}
                    >
                      暂停
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleToggleStatus(goal.id, goal.status)}
                    >
                      激活
                    </Button>
                  ),
                  <Popconfirm
                    title="确定要删除这个目标吗？"
                    onConfirm={() => handleDelete(goal.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      {goal.title}
                    </h3>
                    <Space size="middle">
                      <span>📅 每日 {goal.dailyTime} 分钟</span>
                      <span>🏷️ {goal.category}</span>
                      {getStatusTag(goal.status)}
                    </Space>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="创建新目标"
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="目标标题"
            name="title"
            rules={[{ required: true, message: "请输入目标标题" }]}
          >
            <Input placeholder="例如：学习AI产品经理" />
          </Form.Item>

          <Form.Item
            label="目标类别"
            name="category"
            rules={[{ required: true, message: "请选择目标类别" }]}
          >
            <Select placeholder="选择类别">
              {categories.map((cat) => (
                <Option key={cat.value} value={cat.value}>
                  {cat.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="每日投入时间（分钟）"
            name="dailyTime"
            rules={[{ required: true, message: "请输入每日投入时间" }]}
          >
            <InputNumber
              min={5}
              max={480}
              placeholder="30"
              className="w-full"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting} block>
              创建目标
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
