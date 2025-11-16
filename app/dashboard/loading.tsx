export default function DashboardLoading() {
  return (
    <div className="container mx-auto p-8 max-w-7xl">
      {/* 标题骨架 */}
      <div className="mb-12 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-64 mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-96"></div>
      </div>

      {/* 统计卡片骨架 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-3"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-2"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
          </div>
        ))}
      </div>

      {/* 快速操作和最近进度骨架 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快速操作 */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-6"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </div>
        </div>

        {/* 最近进度 */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-6 animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-40"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

