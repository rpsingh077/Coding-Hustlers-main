export interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalChapters: number;
  estimatedHours: number;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  content: string;
  testType: 'mcq' | 'coding';
  difficulty: string;
  topics?: string[];
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedChapters: string[];
  currentChapter: number;
  lastAccessedAt: string;
  testScores: {
    chapterId: string;
    score: number;
    maxScore: number;
    passed: boolean;
    completedAt: string;
  }[];
}
