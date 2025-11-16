export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div className="relative">
        {/* 主要加载动画 - 脉冲圆环 */}
        <div className="relative w-24 h-24">
          {/* 外圈 */}
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
          
          {/* 旋转渐变圈 */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-black dark:border-t-white animate-spin"></div>
          
          {/* 内圈脉冲 */}
          <div className="absolute inset-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 animate-pulse"></div>
          
          {/* 中心点 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black dark:bg-white animate-ping"></div>
          </div>
        </div>
        
        {/* 加载文字 */}
        <div className="mt-8 text-center">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse">
            加载中...
          </p>
        </div>
      </div>
    </div>
  );
}

