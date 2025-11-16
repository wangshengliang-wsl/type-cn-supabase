// 课程相关类型定义

export interface LessonItem {
  item_id: string;
  type: 'word' | 'sentence';
  en: string;
  zh: string;
  py: string;
  accepted: string[];
  audio: string;
}

export interface Lesson {
  lesson_id: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  cover: string;
  tag: string;
  order: number;
  items: LessonItem[];
}

export interface UserLessonProgress {
  lessonId: string;
  completedItems: number;
  totalItems: number;
  completed: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  subscription: 'free' | 'monthly' | 'lifetime';
  currentStreak: number;
  totalCompleted: number;
}

export type LessonTag = 'Greeting' | 'Conversation' | 'Food' | 'Travel' | 'Shopping' | 'All';

