import { CourseProgress } from '../types/course';

const COURSE_PROGRESS_KEY = 'coding_hustlers_course_progress';

export function getCourseProgress(userId: string, courseId?: string): CourseProgress[] {
  const progress = localStorage.getItem(COURSE_PROGRESS_KEY);
  if (!progress) return [];

  const allProgress = JSON.parse(progress) as CourseProgress[];
  let filtered = allProgress.filter(p => p.userId === userId);

  if (courseId) {
    filtered = filtered.filter(p => p.courseId === courseId);
  }

  return filtered;
}

export function saveCourseProgress(progress: CourseProgress): void {
  const allProgress = getAllProgress();
  const existingIndex = allProgress.findIndex(
    p => p.userId === progress.userId && p.courseId === progress.courseId
  );

  if (existingIndex !== -1) {
    allProgress[existingIndex] = progress;
  } else {
    allProgress.push(progress);
  }

  localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(allProgress));
}

export function updateChapterCompletion(
  userId: string,
  courseId: string,
  chapterId: string,
  score: number,
  maxScore: number
): void {
  const progressList = getCourseProgress(userId, courseId);
  let progress: CourseProgress;

  if (progressList.length > 0) {
    progress = progressList[0];
  } else {
    progress = {
      userId,
      courseId,
      completedChapters: [],
      currentChapter: 1,
      lastAccessedAt: new Date().toISOString(),
      testScores: []
    };
  }

  const passed = score >= maxScore * 0.6;

  if (passed && !progress.completedChapters.includes(chapterId)) {
    progress.completedChapters.push(chapterId);
    progress.currentChapter = progress.completedChapters.length + 1;
  }

  const scoreIndex = progress.testScores.findIndex(s => s.chapterId === chapterId);
  const scoreEntry = {
    chapterId,
    score,
    maxScore,
    passed,
    completedAt: new Date().toISOString()
  };

  if (scoreIndex !== -1) {
    if (score > progress.testScores[scoreIndex].score) {
      progress.testScores[scoreIndex] = scoreEntry;
    }
  } else {
    progress.testScores.push(scoreEntry);
  }

  progress.lastAccessedAt = new Date().toISOString();
  saveCourseProgress(progress);
}

export function isChapterUnlocked(userId: string, courseId: string, chapterOrder: number): boolean {
  if (chapterOrder === 1) return true;

  const progressList = getCourseProgress(userId, courseId);
  if (progressList.length === 0) return false;

  const progress = progressList[0];
  return progress.completedChapters.length >= chapterOrder - 1;
}

export function getLatestCourseProgress(userId: string): CourseProgress | null {
  const allProgress = getCourseProgress(userId);
  if (allProgress.length === 0) return null;

  return allProgress.sort((a, b) =>
    new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
  )[0];
}

function getAllProgress(): CourseProgress[] {
  const progress = localStorage.getItem(COURSE_PROGRESS_KEY);
  return progress ? JSON.parse(progress) : [];
}
