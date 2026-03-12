"use client";

import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="text-center max-w-3xl px-8">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-6">
          Gemdrfly OS
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">
          AI驱动的行为操作系统
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
          让持续行动变得更容易，而不是消耗你的意志力
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            type="primary"
            size="large"
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            开始使用
          </Button>
          <Button
            size="large"
            onClick={() => router.push("/signup")}
          >
            立即注册
          </Button>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              🎯 目标驱动
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              设定你的目标，系统自动生成每日可执行任务
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              🤖 AI引导
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              智能激励系统，让你轻松开始行动
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-gray-900 transition-colors duration-300">
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
              📊 持续反馈
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              实时追踪你的成长，保持动力
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
