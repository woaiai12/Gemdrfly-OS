import { Skeleton } from "antd";

export function ChartSkeleton({ title }: { title: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md dark:shadow-gray-900">
      <Skeleton.Input active size="small" className="mb-4" style={{ width: 150 }} />
      <Skeleton.Input active className="w-full" style={{ height: 300 }} />
    </div>
  );
}
