import { Skeleton } from "antd";

export function TaskListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm dark:shadow-gray-900"
        >
          <div className="flex items-center gap-4">
            <Skeleton.Button active size="small" />
            <div className="flex-1">
              <Skeleton.Input active size="small" className="mb-2" />
              <Skeleton.Button active size="small" style={{ width: 150 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
