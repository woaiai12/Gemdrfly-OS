export function FullScreenLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-black/80 flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">加载中...</p>
      </div>
    </div>
  );
}
