"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// 禁用静态生成，使用动态渲染
export const dynamic = 'force-dynamic';

type FieldType = {
  email: string;
  password: string;
};

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);
      await login(values.email, values.password);

      // 真实Firebase模式：设置认证cookie
      if (!isDemoMode) {
        document.cookie = "auth-token=authenticated; path=/; max-age=86400";
      }

      message.success("登录成功！正在跳转...");

      // 等待一小段时间让状态更新
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error: any) {
      message.error(error.message || "登录失败，请检查邮箱和密码");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();

      // 演示模式：设置cookie
      if (isDemoMode) {
        document.cookie = "demo-session=true; path=/; max-age=86400";
      }

      message.success("登录成功！");
      router.push("/dashboard");
    } catch (error: any) {
      message.error(error.message || "Google登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 transition-colors duration-300">
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            欢迎回来
          </h1>
          <p className="text-gray-600 dark:text-gray-400">登录到Gemdrfly OS</p>
        </div>

        <Button
          icon={<GoogleOutlined />}
          onClick={handleGoogleLogin}
          loading={loading}
          className="w-full mb-6"
          size="large"
        >
          使用Google登录
        </Button>

        <Divider>或</Divider>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          className="mt-6"
        >
          <Form.Item<FieldType>
            label="邮箱"
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="your@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label={
              <div className="flex justify-between items-center w-full">
                <span>密码</span>
                <Link href="/reset-password" className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  忘记密码？
                </Link>
              </div>
            }
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full"
              size="large"
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
          还没有账号？{" "}
          <Link href="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            立即注册
          </Link>
        </div>
      </Card>
    </div>
  );
}
