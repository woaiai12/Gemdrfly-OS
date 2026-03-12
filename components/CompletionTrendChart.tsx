"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { CalendarOutlined } from "@ant-design/icons";

interface CompletionTrendChartProps {
  data: Array<{
    date: string;
    completed: number;
    total: number;
  }>;
}

export function CompletionTrendChart({ data }: CompletionTrendChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-gray-900 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <CalendarOutlined className="text-blue-600 dark:text-blue-400 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          近7天完成趋势
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={document.documentElement.classList.contains("dark") ? "#404040" : "#e0e0e0"} />
          <XAxis
            dataKey="date"
            stroke={document.documentElement.classList.contains("dark") ? "#9ca3af" : "#6b7280"}
            tick={{ fill: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#6b7280" }}
          />
          <YAxis
            stroke={document.documentElement.classList.contains("dark") ? "#9ca3af" : "#6b7280"}
            tick={{ fill: document.documentElement.classList.contains("dark") ? "#9ca3af" : "#6b7280" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
              border: `1px solid ${document.documentElement.classList.contains("dark") ? "#404040" : "#e0e0e0"}`,
              borderRadius: "8px",
              color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="completed"
            name="已完成"
            stroke="#4f46e5"
            strokeWidth={2}
            dot={{ fill: "#4f46e5", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="总任务"
            stroke="#9ca3af"
            strokeWidth={2}
            dot={{ fill: "#9ca3af", r: 4 }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
