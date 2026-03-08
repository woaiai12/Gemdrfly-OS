"use client";

import { Layout, Menu, Button, Avatar, Dropdown } from "antd";
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

const { Header, Content, Sider } = Layout;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-blue-600">Gemdrfly OS</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[pathname]}
          items={menuItems}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div></div>
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
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
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
