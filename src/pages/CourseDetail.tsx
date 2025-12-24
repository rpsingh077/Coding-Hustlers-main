import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, PlayCircle, FileText, Trophy, Clock } from 'lucide-react';
import Sidebar, { MobileSidebarToggle } from '../components/Sidebar';
import ChapterOverview from '../components/ChapterOverview';
import { useAuth } from '../contexts/AuthContext';
import { courses, chapters } from '../lib/courseData';
import { getCourseProgress, enrollInCourse, subscribeToCourseProgress, CourseProgress } from '../services/firestore';
import { generateDefaultTopics } from '../lib/topicsGenerator';
import type { Chapter } from '../types/course';

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [showOverview, setShowOverview] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  const course = courses.find(c => c.id === courseId);
  const courseChapters = courseId ? chapters[courseId] || [] : [];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [courseId]);

  useEffect(() => {
    if (!currentUser || !courseId) return;

    const initializeProgress = async () => {
      try {
        const courseProgress = await getCourseProgress(currentUser.uid, courseId);
        if (!courseProgress) {
          await enrollInCourse(currentUser.uid, courseId);
        }
      } catch (error) {
        console.error('Error initializing progress:', error);
      }
    };

    initializeProgress();

    const unsubscribe = subscribeToCourseProgress(
      currentUser.uid,
      courseId,
      (courseProgress) => {
        setProgress(courseProgress);
      }
    );

    return () => unsubscribe();
  }, [currentUser, courseId]);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const isChapterUnlocked = (chapterOrder: number): boolean => {
    if (chapterOrder === 1) return true;
    if (!progress) return false;
    return progress.completedChapters.includes(chapterOrder - 1);
  };

  const handleChapterClick = (chapter: Chapter) => {
    if (!currentUser) return;

    const unlocked = isChapterUnlocked(chapter.order);
    if (!unlocked) return;

    setSelectedChapter(chapter);
    setShowOverview(true);
  };

  const handleOverviewContinue = () => {
    setShowOverview(false);
    if (selectedChapter) {
      navigate(`/course/${courseId}/chapter/${selectedChapter.id}`, {
        state: { chapter: selectedChapter, course }
      });
    }
  };

  const isCompleted = (chapterOrder: number): boolean => {
    return progress?.completedChapters.includes(chapterOrder) || false;
  };

  const getChapterScore = (chapterOrder: number) => {
    if (!progress?.chapterScores) return null;
    return progress.chapterScores[chapterOrder];
  };

  const progressPercentage = progress
    ? Math.round((progress.completedChapters.length / courseChapters.length) * 100)
    : 0;

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: `
        radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
        radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
        radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
        radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
        #F5F5F5
      `
    }}>
      <div className="absolute inset-0 bg-[rgba(245,245,245,0.65)] backdrop-blur-[25px]"></div>

      <div className="relative z-10">
        <MobileSidebarToggle onClick={() => setSidebarOpen(true)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
          <button
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-['Syne'] font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </button>

          <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 lg:p-8 shadow-lg border border-white/40 mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-5xl shadow-xl`}>
                {course.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold font-['Syne'] text-gray-800 mb-2">
                  {course.title}
                </h1>
                <p className="text-gray-600 font-['Syne'] text-base lg:text-lg mb-4">
                  {course.description}
                </p>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="font-['Syne']">{course.totalChapters} chapters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-['Syne']">{course.estimatedHours} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    <span className="font-['Syne']">{course.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>

            {progress && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-['Syne'] text-gray-600 font-medium">Your Progress</span>
                  <span className="text-sm font-['Poppins'] font-bold text-gray-800">{progressPercentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${course.color} transition-all duration-500`}
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 font-['Syne'] mt-2">
                  {progress.completedChapters.length} of {courseChapters.length} chapters completed
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {courseChapters.map((chapter) => {
              const unlocked = isChapterUnlocked(chapter.order);
              const completed = isCompleted(chapter.order);
              const score = getChapterScore(chapter.order);
              const chapterTopics = chapter.topics || generateDefaultTopics(chapter.description, chapter.title);

              return (
                <div
                  key={chapter.id}
                  className={`relative bg-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-md border-2 transition-all duration-300 ${
                    unlocked
                      ? 'border-gray-200 hover:shadow-xl hover:border-purple-300'
                      : 'border-gray-200 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex items-center justify-center shadow-sm transition-all ${
                      completed
                        ? 'border-green-500 bg-green-50'
                        : unlocked
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}>
                      {completed ? (
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                      ) : unlocked ? (
                        <PlayCircle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-500" />
                      ) : (
                        <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold font-['Syne'] text-gray-900 mb-2">
                            Level {chapter.order}: {chapter.title}
                          </h3>
                          <p className="text-sm sm:text-base text-gray-600 font-['Syne'] mb-4">
                            {chapter.description}
                          </p>
                        </div>

                        <div className={`self-start px-3 py-1.5 rounded-md text-xs font-bold font-['Poppins'] text-white whitespace-nowrap flex-shrink-0 ${
                          chapter.testType === 'mcq'
                            ? 'bg-blue-500'
                            : 'bg-purple-600'
                        }`}>
                          {chapter.testType === 'mcq' ? 'MCQ' : 'CODING'}
                        </div>
                      </div>

                      {chapterTopics && chapterTopics.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-3 sm:p-4 mb-4 border border-gray-200">
                          <h4 className="text-xs sm:text-sm font-bold text-gray-700 font-['Syne'] mb-2 sm:mb-3">Learning Objectives:</h4>
                          <ul className="space-y-1.5 sm:space-y-2">
                            {chapterTopics.slice(0, 4).map((topic, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 font-['Syne']">
                                <span className="text-purple-500 mt-0.5 sm:mt-1 flex-shrink-0">●</span>
                                <span className="break-words">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                          <span className="font-['Syne']">20 min</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                          <span className="font-['Syne']">12 questions</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0" />
                          <span className="font-['Syne']">60% to pass</span>
                        </div>
                        {completed && score && (
                          <div className="flex items-center gap-1.5 sm:gap-2 text-green-600 font-bold w-full sm:w-auto">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                            <span className="font-['Poppins'] text-xs sm:text-sm">
                              MCQ: {score.mcqScore}% | Coding: {score.codingScore}%
                            </span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => unlocked && handleChapterClick(chapter)}
                        disabled={!unlocked}
                        className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-['Syne'] font-semibold text-white text-sm sm:text-base transition-all ${
                          unlocked
                            ? 'bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 shadow-md hover:shadow-lg'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
                      >
                        {completed ? 'Review Level' : 'Start Level'}
                      </button>
                    </div>
                  </div>

                  {!unlocked && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                      <div className="bg-white rounded-xl px-6 py-3 shadow-lg border-2 border-gray-200">
                        <div className="flex items-center gap-2 text-gray-700 font-['Syne'] font-semibold">
                          <Lock className="w-5 h-5" />
                          Complete previous level to unlock
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {showOverview && selectedChapter && (
        <ChapterOverview
          chapterTitle={selectedChapter.title}
          chapterDescription={selectedChapter.description}
          difficulty={selectedChapter.difficulty}
          onContinue={handleOverviewContinue}
        />
      )}
    </div>
  );
};

export default CourseDetail;
