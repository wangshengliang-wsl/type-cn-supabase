export default function CoursesLoading() {
  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-12 animate-pulse">
        <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-48 mb-3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded-lg w-96"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* 图片骨架 */}
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900"></div>
            
            {/* 内容骨架 */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-5/6"></div>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-16"></div>
              </div>
              
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
              
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded-lg w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

