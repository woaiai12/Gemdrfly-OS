"use client";

import { Layout, Menu, Button, Avatar, Dropdown, Spin } from "antd";
import {
  HomeOutlined,
  AimOutlined,
  TrophyOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FullScreenLoader } from "@/components/FullScreenLoader";
import { useState, useEffect } from "react";

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    // 初始加载动画
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <HomeOutlined />,
      label: <Link href="/dashboard">今日任务</Link>,
    },
    {
      key: "/dashboard/goals",
      icon: <AimOutlined />,
      label: <Link href="/dashboard/goals">我的目标</Link>,
    },
    {
      key: "/dashboard/progress",
      icon: <TrophyOutlined />,
      label: <Link href="/dashboard/progress">成长进度</Link>,
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
      onClick: () => router.push("/dashboard/profile"),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ];

  if (initialLoading || loading) {
    return <FullScreenLoader />;
  }

  return (
    <Layout className="min-h-screen transition-colors duration-300">
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className="bg-white dark:bg-gray-900 dark:border-r dark:border-gray-800 transition-colors duration-300"
        style={{
          background: "#fff",
        }}
      >
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Gemdrfly OS
          </h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
          className="bg-white dark:bg-gray-900"
        />
      </Sider>
      <Layout className="transition-colors duration-300">
        <Header
          className="px-6 bg-white dark:bg-gray-900 dark:border-b dark:border-gray-800 transition-colors duration-300 flex justify-between items-center"
          style={{
            padding: "0 24px",
            background: "#fff",
          }}
        >
          <div></div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
              placement="bottomRight"
            >
              <Button type="text" icon={<Avatar icon={<UserOutlined />} />}>
                {currentUser?.email}
              </Button>
            </Dropdown>
          </div>
        </Header>
        <Content
          className="m-4 mx-6 p-6 bg-white dark:bg-gray-900 rounded-lg transition-colors duration-300"
          style={{
            background: "#fff",
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
