"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Alert } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import logger from "@/lib/logger";

export const dynamic = 'force-dynamic';

type FieldType = {
  email: string;
};

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();
  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    if (isDemoMode) {
      message.warning("演示模式不支持密码重置功能");
      return;
    }

    setLoading(true);
    try {
      logger.info("Password reset requested", { email: values.email });
      await resetPassword(values.email);
      setSuccess(true);
      message.success("密码重置邮件已发送，请检查您的邮箱");
      logger.info("Password reset email sent", { email: values.email });
    } catch (error) {
      logger.error("Password reset error", error as Error, { email: values.email });
      message.error("发送密码重置邮件失败，请检查邮箱地址是否正确");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: unknown) => {
    logger.warn("Password reset form validation failed", { errorInfo });
    message.error("请检查表单输入");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Gemdrfly OS
          </h1>
          <p className="text-gray-600 dark:text-gray-400">重置您的密码</p>
        </div>

        {success ? (
          <Alert
            message="邮件已发送"
            description="我们已向您的邮箱发送了密码重置链接。请查收邮件并按照说明重置密码。"
            type="success"
            showIcon
            className="mb-6"
          />
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              请输入您的注册邮箱，我们将向您发送密码重置链接。
            </p>

            <Form
              name="reset_password"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              layout="vertical"
            >
              <Form.Item<FieldType>
                label="邮箱地址"
                name="email"
                rules={[
                  { required: true, message: "请输入您的邮箱地址" },
                  { type: "email", message: "请输入有效的邮箱地址" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="text-gray-400" />}
                  placeholder="your@email.com"
                  size="large"
                />
              </Form.Item>

              <Form.Item className="mb-4">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  发送重置邮件
                </Button>
              </Form.Item>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">记住密码了？</span>
                <Link href="/login" className="text-purple-600 hover:text-purple-700 ml-1">
                  返回登录
                </Link>
              </div>
            </Form>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
          <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white text-sm">
            返回首页
          </Link>
        </div>
      </Card>
    </div>
  );
}
