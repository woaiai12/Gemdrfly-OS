"use client";

import { Card, Descriptions, Button, Space, Divider, Tag } from "antd";
import {
  UserOutlined,
  MailOutlined,
  CalendarOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";

export default function ProfilePage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">个人资料</h2>

      <Card>
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserOutlined className="text-4xl text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold">
            {currentUser.displayName || "用户"}
          </h3>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>

        <Divider />

        <Descriptions column={1} bordered>
          <Descriptions.Item
            label={<span className="font-medium">用户ID</span>}
          >
            <code className="bg-gray-100 px-2 py-1 rounded">
              {currentUser.uid}
            </code>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-medium">邮箱地址</span>}
          >
            <Space>
              <MailOutlined />
              {currentUser.email}
              {currentUser.emailVerified && (
                <Tag color="green">已验证</Tag>
              )}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-medium">显示名称</span>}
          >
            {currentUser.displayName || "未设置"}
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-medium">注册时间</span>}
          >
            <Space>
              <CalendarOutlined />
              {currentUser.metadata?.creationTime
                ? new Date(
                    currentUser.metadata.creationTime
                  ).toLocaleDateString("zh-CN")
                : "未知"}
            </Space>
          </Descriptions.Item>

          <Descriptions.Item
            label={<span className="font-medium">最后登录</span>}
          >
            <Space>
              <CalendarOutlined />
              {currentUser.metadata?.lastSignInTime
                ? new Date(
                    currentUser.metadata.lastSignInTime
                  ).toLocaleDateString("zh-CN")
                : "未知"}
            </Space>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div className="text-center">
          <Space>
            <Button icon={<EditOutlined />}>编辑资料</Button>
            <Button danger onClick={handleLogout}>
              退出登录
            </Button>
          </Space>
        </div>

        <Divider />

        <Card
          type="inner"
          title="账户信息"
          style={{ marginTop: 16 }}
        >
          <p className="text-gray-600">
            演示模式：当前使用的是演示账户，数据不会持久化保存。
          </p>
          <p className="text-gray-600 mt-2">
            要使用完整功能，请配置真实的Firebase项目。
          </p>
        </Card>
      </Card>
    </div>
  );
}
