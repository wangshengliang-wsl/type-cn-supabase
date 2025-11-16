export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black p-8 animate-pulse">
      {/* 头部骨架 */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-lg w-48"></div>
          </div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        
        {/* 进度条 */}
        <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 描述卡片 */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
        </div>

        {/* 问题卡片 */}
        <div className="border border-gray-200 dark:border-gray-800 rounded-2xl p-12">
          <div className="text-center space-y-6">
            <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-lg w-64 mx-auto"></div>
            <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto"></div>
            <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-32 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

