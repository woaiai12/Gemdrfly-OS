import { Skeleton } from "antd";

export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-gray-900">
      <Skeleton.Button active size="small" className="mb-4" style={{ width: 100 }} />
      <Skeleton.Input active size="large" style={{ width: 120 }} />
    </div>
  );
}
