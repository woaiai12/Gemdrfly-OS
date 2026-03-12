import { Skeleton } from "antd";

export function GoalListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-gray-900"
        >
          <Skeleton.Input active size="small" className="mb-3" />
          <div className="flex justify-between mb-2">
            <Skeleton.Button active size="small" style={{ width: 120 }} />
            <Skeleton.Button active size="small" style={{ width: 80 }} />
          </div>
          <Skeleton.Input active className="w-full" />
        </div>
      ))}
    </div>
  );
}
