"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { TrophyOutlined } from "@ant-design/icons";

interface GoalProgressChartProps {
  data: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export function GoalProgressChart({ data }: GoalProgressChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-gray-900 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <TrophyOutlined className="text-yellow-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          目标进度分布
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: document.documentElement.classList.contains("dark") ? "#1a1a1a" : "#ffffff",
              border: `1px solid ${document.documentElement.classList.contains("dark") ? "#404040" : "#e0e0e0"}`,
              borderRadius: "8px",
              color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
