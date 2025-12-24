import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { UserProfile, UserSettings } from '../types/profile';
import { Test, Question } from '../lib/localStorage';

const convertTimestamp = (timestamp: Timestamp | Date): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export const createUserProfile = async (
  uid: string,
  email: string,
  displayName: string
): Promise<void> => {
  const profileRef = doc(db, 'profiles', uid);
  await setDoc(profileRef, {
    uid,
    email,
    displayName,
    bio: '',
    location: '',
    website: '',
    github: '',
    linkedin: '',
    company: '',
    role: '',
    skills: [],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  const settingsRef = doc(db, 'settings', uid);
  await setDoc(settingsRef, {
    uid,
    emailNotifications: true,
    testReminders: true,
    weeklyReport: true,
    publicProfile: true,
    showEmail: false,
    theme: 'light',
    language: 'en',
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const profileRef = doc(db, 'profiles', uid);
  const profileSnap = await getDoc(profileRef);

  if (profileSnap.exists()) {
    const data = profileSnap.data();
    return {
      ...data,
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as UserProfile;
  }
  return null;
};

export const updateUserProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> => {
  const profileRef = doc(db, 'profiles', uid);
  await updateDoc(profileRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const getUserSettings = async (uid: string): Promise<UserSettings | null> => {
  const settingsRef = doc(db, 'settings', uid);
  const settingsSnap = await getDoc(settingsRef);

  if (settingsSnap.exists()) {
    const data = settingsSnap.data();
    return {
      ...data,
      updatedAt: convertTimestamp(data.updatedAt),
    } as UserSettings;
  }
  return null;
};

export const updateUserSettings = async (
  uid: string,
  updates: Partial<UserSettings>
): Promise<void> => {
  const settingsRef = doc(db, 'settings', uid);
  await updateDoc(settingsRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

export const saveTestToFirestore = async (
  test: Omit<Test, 'id' | 'created_at'>
): Promise<string> => {
  const testsRef = collection(db, 'tests');
  const docRef = await addDoc(testsRef, {
    ...test,
    created_at: serverTimestamp(),
  });
  return docRef.id;
};

export const updateTestInFirestore = async (
  testId: string,
  updates: Partial<Test>
): Promise<void> => {
  const testRef = doc(db, 'tests', testId);
  await updateDoc(testRef, updates);
};

export const getUserTests = async (userId: string): Promise<Test[]> => {
  const testsRef = collection(db, 'tests');
  const q = query(
    testsRef,
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const tests: Test[] = [];

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    tests.push({
      ...data,
      id: doc.id,
      created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
      completed_at: data.completed_at?.toDate?.()?.toISOString() || data.completed_at,
    } as Test);
  });

  return tests;
};

export const getTestStats = async (userId: string) => {
  const tests = await getUserTests(userId);

  const uniqueTests = tests.reduce((acc: Test[], current) => {
    const existing = acc.find(t => t.title === current.title);
    if (!existing) {
      acc.push(current);
    } else {
      const existingIndex = acc.indexOf(existing);
      if (new Date(current.created_at).getTime() > new Date(existing.created_at).getTime()) {
        acc[existingIndex] = current;
      }
    }
    return acc;
  }, []);

  const completed = uniqueTests.filter((t: Test) => t.status === 'completed');
  const passed = completed.filter((t: Test) => t.score >= t.max_score * 0.6);
  const failed = completed.filter((t: Test) => t.score < t.max_score * 0.6);
  const pending = uniqueTests.filter((t: Test) => t.status === 'pending_result');

  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((sum: number, t: Test) => sum + (t.score / t.max_score) * 100, 0) / completed.length)
    : 0;

  return {
    totalTests: uniqueTests.length,
    passed: passed.length,
    failed: failed.length,
    pending: pending.length,
    avgScore,
    tests: uniqueTests,
  };
};

export const saveQuestionsToFirestore = async (
  questions: Omit<Question, 'id'>[]
): Promise<void> => {
  const questionsRef = collection(db, 'questions');

  const promises = questions.map((q) =>
    addDoc(questionsRef, q)
  );

  await Promise.all(promises);
};

export const updateQuestionInFirestore = async (
  testId: string,
  questionText: string,
  updates: Partial<Question>
): Promise<void> => {
  const questionsRef = collection(db, 'questions');
  const q = query(
    questionsRef,
    where('test_id', '==', testId),
    where('question', '==', questionText),
    limit(1)
  );

  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const questionDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'questions', questionDoc.id), updates);
  }
};

export interface CourseProgress {
  userId: string;
  courseId: string;
  currentChapter: number;
  completedChapters: number[];
  chapterScores: Record<number, {
    mcqScore: number;
    codingScore: number;
    completed: boolean;
  }>;
  status: 'not_started' | 'in_progress' | 'completed';
  enrolledAt: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
}

export const enrollInCourse = async (userId: string, courseId: string): Promise<void> => {
  const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
  const progressSnap = await getDoc(progressRef);

  if (!progressSnap.exists()) {
    await setDoc(progressRef, {
      userId,
      courseId,
      currentChapter: 1,
      completedChapters: [],
      chapterScores: {},
      status: 'in_progress',
      enrolledAt: serverTimestamp(),
      lastAccessedAt: serverTimestamp(),
    });
  }
};

export const getCourseProgress = async (
  userId: string,
  courseId: string
): Promise<CourseProgress | null> => {
  const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
  const progressSnap = await getDoc(progressRef);

  if (progressSnap.exists()) {
    const data = progressSnap.data();
    return {
      ...data,
      enrolledAt: convertTimestamp(data.enrolledAt),
      lastAccessedAt: convertTimestamp(data.lastAccessedAt),
      completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
    } as CourseProgress;
  }
  return null;
};

export const updateCourseProgress = async (
  userId: string,
  courseId: string,
  updates: Partial<CourseProgress>
): Promise<void> => {
  const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
  await updateDoc(progressRef, {
    ...updates,
    lastAccessedAt: serverTimestamp(),
  });
};

export const saveChapterScore = async (
  userId: string,
  courseId: string,
  chapterNumber: number,
  mcqScore: number,
  codingScore: number,
  totalChapters: number
): Promise<void> => {
  try {
    const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);
    let progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      console.log('Progress document does not exist, enrolling user...');
      await enrollInCourse(userId, courseId);
      progressSnap = await getDoc(progressRef);

      if (!progressSnap.exists()) {
        throw new Error('Failed to create progress document');
      }
    }

    const data = progressSnap.data();
    const chapterScores = data?.chapterScores || {};
    const completedChapters = data?.completedChapters || [];

    const passingMCQScore = 60;
    const passingCodingScore = 60;
    const chapterPassed = mcqScore >= passingMCQScore && codingScore >= passingCodingScore;

    console.log('Saving chapter score:', { chapterNumber, mcqScore, codingScore, chapterPassed });

    chapterScores[chapterNumber] = {
      mcqScore,
      codingScore,
      completed: chapterPassed,
    };

    if (chapterPassed && !completedChapters.includes(chapterNumber)) {
      completedChapters.push(chapterNumber);
      completedChapters.sort((a, b) => a - b);
    }

    const allChaptersCompleted = completedChapters.length === totalChapters;
    const courseStatus = allChaptersCompleted ? 'completed' : 'in_progress';

    const updateData: Record<string, unknown> = {
      chapterScores,
      completedChapters,
      status: courseStatus,
      lastAccessedAt: serverTimestamp(),
    };

    if (chapterPassed && chapterNumber < totalChapters) {
      updateData.currentChapter = chapterNumber + 1;
    }

    if (allChaptersCompleted) {
      updateData.completedAt = serverTimestamp();
    }

    console.log('Updating progress with data:', updateData);
    await updateDoc(progressRef, updateData);
    console.log('Chapter score saved successfully!');
  } catch (error) {
    console.error('Error saving chapter score:', error);
    throw error;
  }
};

export const getUserCourseStats = async (userId: string) => {
  const progressRef = collection(db, 'courseProgress');
  const q = query(progressRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  let enrolled = 0;
  let inProgress = 0;
  let completed = 0;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    enrolled++;

    if (data.status === 'completed') {
      completed++;
    } else if (data.status === 'in_progress') {
      inProgress++;
    }
  });

  return {
    enrolled,
    inProgress,
    completed,
  };
};

export const getAllUserCourseProgress = async (userId: string): Promise<Record<string, CourseProgress>> => {
  const progressRef = collection(db, 'courseProgress');
  const q = query(progressRef, where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  const progressMap: Record<string, CourseProgress> = {};

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    progressMap[data.courseId] = {
      ...data,
      enrolledAt: convertTimestamp(data.enrolledAt),
      lastAccessedAt: convertTimestamp(data.lastAccessedAt),
      completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
    } as CourseProgress;
  });

  return progressMap;
};

export const subscribeToUserTests = (
  userId: string,
  callback: (tests: Test[]) => void
) => {
  const testsRef = collection(db, 'tests');
  const q = query(
    testsRef,
    where('user_id', '==', userId),
    orderBy('created_at', 'desc')
  );

  return onSnapshot(q, (querySnapshot) => {
    const tests: Test[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      tests.push({
        ...data,
        id: doc.id,
        created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        completed_at: data.completed_at?.toDate?.()?.toISOString() || data.completed_at,
      } as Test);
    });
    callback(tests);
  });
};

export const subscribeToCourseProgress = (
  userId: string,
  courseId: string,
  callback: (progress: CourseProgress | null) => void
) => {
  const progressRef = doc(db, 'courseProgress', `${userId}_${courseId}`);

  return onSnapshot(progressRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback({
        ...data,
        enrolledAt: convertTimestamp(data.enrolledAt),
        lastAccessedAt: convertTimestamp(data.lastAccessedAt),
        completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
      } as CourseProgress);
    } else {
      callback(null);
    }
  });
};

export const subscribeToAllUserCourseProgress = (
  userId: string,
  callback: (progressMap: Record<string, CourseProgress>) => void
) => {
  const progressRef = collection(db, 'courseProgress');
  const q = query(progressRef, where('userId', '==', userId));

  return onSnapshot(q, (querySnapshot) => {
    const progressMap: Record<string, CourseProgress> = {};

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      progressMap[data.courseId] = {
        ...data,
        enrolledAt: convertTimestamp(data.enrolledAt),
        lastAccessedAt: convertTimestamp(data.lastAccessedAt),
        completedAt: data.completedAt ? convertTimestamp(data.completedAt) : undefined,
      } as CourseProgress;
    });

    callback(progressMap);
  });
};
