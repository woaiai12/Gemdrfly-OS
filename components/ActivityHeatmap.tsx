"use client";

import { FireOutlined } from "@ant-design/icons";

interface ActivityHeatmapProps {
  data: Array<{
    date: string;
    count: number;
  }>;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  // 按周分组数据
  const weeks: Array<Array<{ date: string; count: number }>> = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-gray-100 dark:bg-gray-800";
    if (count <= 2) return "bg-green-200 dark:bg-green-900";
    if (count <= 4) return "bg-green-400 dark:bg-green-700";
    if (count <= 6) return "bg-green-600 dark:bg-green-600";
    return "bg-green-800 dark:bg-green-500";
  };

  const days = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-gray-900 transition-colors duration-300">
      <div className="flex items-center gap-2 mb-4">
        <FireOutlined className="text-orange-500 text-xl" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          活动热力图
        </h3>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1 mb-2 pl-8">
            {days.map((day) => (
              <div key={day} className="text-xs text-gray-500 dark:text-gray-400 w-8 text-center">
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex gap-1 mb-1">
              <div className="text-xs text-gray-400 dark:text-gray-500 w-8 flex items-center">
                {weekIndex + 1}
              </div>
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`w-8 h-8 rounded-sm ${getIntensity(day.count)} transition-colors duration-200`}
                  title={`${day.date}: ${day.count} 个任务`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
        <span>少</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <div className="w-3 h-3 rounded-sm bg-green-200 dark:bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-400 dark:bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-600 dark:bg-green-600" />
          <div className="w-3 h-3 rounded-sm bg-green-800 dark:bg-green-500" />
        </div>
        <span>多</span>
      </div>
    </div>
  );
}
