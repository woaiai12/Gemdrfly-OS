"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FieldType = {
  email: string;
  password: string;
  confirmPassword: string;
};

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const [form] = Form.useForm();

  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);
      await signup(values.email, values.password);

      // 真实Firebase模式：设置认证cookie
      if (!isDemoMode) {
        document.cookie = "auth-token=authenticated; path=/; max-age=86400";
      }

      message.success("注册成功！正在跳转...");

      // 等待一小段时间让状态更新
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        message.error("该邮箱已被注册，请使用其他邮箱");
      } else if (error.code === "auth/weak-password") {
        message.error("密码强度不够，请使用更复杂的密码");
      } else {
        message.error(error.message || "注册失败");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            创建账号
          </h1>
          <p className="text-gray-600">开始你的持续行动之旅</p>
        </div>

        <Form
          form={form}
          name="signup"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
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
              prefix={<MailOutlined />}
              placeholder="your@email.com"
              size="large"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少需要6个字符" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="至少6个字符"
              size="large"
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="确认密码"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: "请确认密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="再次输入密码"
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
              注册
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center text-sm text-gray-600 mt-4">
          已有账号？{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700">
            立即登录
          </Link>
        </div>
      </Card>
    </div>
  );
}
