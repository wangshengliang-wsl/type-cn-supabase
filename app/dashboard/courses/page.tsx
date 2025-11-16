import { CourseList } from "@/components/courses/course-list";
import lessonsData from "@/docs/lessons.json";

export default function CoursesPage() {
  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Course Store
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Browse and start learning from our collection of courses
        </p>
      </div>

      <CourseList lessons={lessonsData} />
    </div>
  );
}

