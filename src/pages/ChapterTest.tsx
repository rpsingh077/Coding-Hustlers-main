import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, CheckCircle, XCircle, Trophy, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateMCQQuestions, generateCodingChallenge, evaluateCodingChallenge } from '../lib/gemini';
import { saveChapterScore } from '../services/firestore';
import { courses } from '../lib/courseData';
import type { Chapter, Course } from '../types/course';

interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface CodingChallenge {
  title: string;
  description: string;
  examples: string[];
  constraints: string[];
  difficulty: string;
}

const ChapterTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { chapter, course } = location.state as { chapter: Chapter; course: Course };

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [codingChallenge, setCodingChallenge] = useState<CodingChallenge | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [userCode, setUserCode] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [maxScore, setMaxScore] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [mcqScore, setMcqScore] = useState(0);
  const [codingScore, setCodingScore] = useState(0);

  useEffect(() => {
    loadTest();
  }, []);

  const loadTest = async () => {
    try {
      setLoading(true);
      if (chapter.testType === 'mcq') {
        const mcqQuestions = await generateMCQQuestions(
          course.title,
          chapter.title,
          chapter.description,
          5
        );
        setQuestions(mcqQuestions);
        setMaxScore(mcqQuestions.length * 10);
      } else {
        const challenge = await generateCodingChallenge(
          course.title,
          chapter.title,
          chapter.description,
          chapter.difficulty
        );
        setCodingChallenge(challenge);
        setMaxScore(100);
      }
    } catch (error) {
      console.error('Error loading test:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMCQSubmit = async () => {
    let correctCount = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = correctCount * 10;
    const mcqPercentage = Math.round((finalScore / maxScore) * 100);
    setScore(finalScore);
    setMcqScore(mcqPercentage);
    setTestCompleted(true);

    if (currentUser) {
      try {
        const fullCourse = courses.find(c => c.id === course.id);
        const totalChapters = fullCourse?.totalChapters || 0;

        console.log('Submitting chapter score...', {
          courseId: course.id,
          chapterOrder: chapter.order,
          mcqScore: mcqPercentage,
          codingScore: 100,
          totalChapters
        });

        await saveChapterScore(
          currentUser.uid,
          course.id,
          chapter.order,
          mcqPercentage,
          100,
          totalChapters
        );

        console.log('Chapter score submitted successfully!');
      } catch (error) {
        console.error('Failed to save chapter score:', error);
        alert('Warning: Your score may not have been saved. Please check your progress.');
      }
    }
  };

  const handleCodingSubmit = async () => {
    if (!userCode.trim()) {
      alert('Please write some code before submitting!');
      return;
    }

    setSubmitting(true);
    try {
      const result = await evaluateCodingChallenge(
        codingChallenge!.title,
        codingChallenge!.description,
        userCode
      );

      setScore(result.score);
      setCodingScore(result.score);
      setFeedback(result.feedback);
      setTestCompleted(true);

      if (currentUser) {
        try {
          const fullCourse = courses.find(c => c.id === course.id);
          const totalChapters = fullCourse?.totalChapters || 0;

          console.log('Submitting chapter score...', {
            courseId: course.id,
            chapterOrder: chapter.order,
            mcqScore: 100,
            codingScore: result.score,
            totalChapters
          });

          await saveChapterScore(
            currentUser.uid,
            course.id,
            chapter.order,
            100,
            result.score,
            totalChapters
          );

          console.log('Chapter score submitted successfully!');
        } catch (saveError) {
          console.error('Failed to save chapter score:', saveError);
          alert('Warning: Your score may not have been saved. Please check your progress.');
        }
      }
    } catch (error) {
      console.error('Error evaluating code:', error);
      alert('Failed to evaluate your code. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setTestCompleted(false);
    setUserAnswers({});
    setUserCode('');
    setScore(0);
    setMcqScore(0);
    setCodingScore(0);
    setFeedback('');
    loadTest();
  };

  const handleContinue = () => {
    navigate(`/course/${course.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: `
          radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
          radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
          radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
          radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
          #F5F5F5
        `
      }}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Syne'] text-lg flex items-center gap-2 justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Generating test with AI...
          </p>
        </div>
      </div>
    );
  }

  if (testCompleted) {
    const passed = score >= maxScore * 0.6;
    const percentage = Math.round((score / maxScore) * 100);

    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{
        background: `
          radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
          radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
          radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
          radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
          #F5F5F5
        `
      }}>
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
              passed ? 'bg-gradient-to-br from-green-400 to-emerald-500' : 'bg-gradient-to-br from-orange-400 to-red-500'
            }`}>
              {passed ? (
                <CheckCircle className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </div>

            <h2 className="text-3xl font-bold font-['Syne'] text-gray-800 mb-2">
              {passed ? 'Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-600 font-['Syne'] mb-6">
              {passed
                ? 'You passed this chapter! Continue to the next one.'
                : 'You need 60% to pass. Review the material and try again.'}
            </p>

            <div className="relative w-32 h-32 mx-auto mb-6">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={passed ? '#10B981' : '#F97316'}
                  strokeWidth="8"
                  fill="none"
                  opacity="0.2"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={passed ? '#10B981' : '#F97316'}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-3xl font-bold font-['Poppins'] ${
                  passed ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {percentage}%
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className={`w-5 h-5 ${passed ? 'text-green-600' : 'text-orange-600'}`} />
                <span className="font-['Syne'] font-bold text-gray-700">Your Score</span>
              </div>
              <p className="text-2xl font-bold font-['Poppins'] text-gray-800">
                {score} / {maxScore}
              </p>
            </div>

            {feedback && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                <h4 className="font-['Syne'] font-bold text-gray-800 mb-2">AI Feedback</h4>
                <p className="text-sm text-gray-700 font-['Syne'] whitespace-pre-line">{feedback}</p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleRetry}
                className="flex-1 py-3 bg-gradient-to-r from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-800 rounded-xl font-['Syne'] font-semibold transition-all"
              >
                Try Again
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-xl text-white rounded-xl font-['Syne'] font-semibold transition-all"
              >
                {passed ? 'Continue Learning' : 'Back to Course'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 lg:p-8" style={{
      background: `
        radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
        radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
        radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
        radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
        #F5F5F5
      `
    }}>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/course/${course.id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-['Syne'] font-medium mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Course
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold font-['Syne'] text-gray-800 mb-2">
                {chapter.title}
              </h1>
              <p className="text-gray-600 font-['Syne']">{chapter.description}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold font-['Poppins'] text-white ${
              chapter.testType === 'mcq'
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                : 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}>
              {chapter.testType === 'mcq' ? 'MCQ TEST' : 'CODING CHALLENGE'}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 font-['Syne']">
              {chapter.content}
            </p>
          </div>
        </div>

        {chapter.testType === 'mcq' ? (
          <div className="space-y-6">
            {questions.map((q, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-['Syne'] font-bold text-gray-800 mb-4">
                  Question {index + 1}: {q.question}
                </h3>
                <div className="space-y-3">
                  {q.options.map((option, optIndex) => (
                    <label
                      key={optIndex}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        userAnswers[index] === option
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        value={option}
                        checked={userAnswers[index] === option}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [index]: e.target.value })}
                        className="w-5 h-5 text-blue-600"
                      />
                      <span className="font-['Syne'] text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleMCQSubmit}
              disabled={Object.keys(userAnswers).length !== questions.length}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-['Syne'] font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Submit Test
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {codingChallenge && (
              <>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-['Syne'] font-bold text-gray-800 text-xl mb-4">
                    {codingChallenge.title}
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 font-['Syne'] mb-4">{codingChallenge.description}</p>

                    {codingChallenge.examples.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-['Syne'] font-bold text-gray-800 mb-2">Examples:</h4>
                        {codingChallenge.examples.map((example, idx) => (
                          <pre key={idx} className="bg-gray-50 p-3 rounded-lg mb-2 text-sm overflow-x-auto">
                            <code>{example}</code>
                          </pre>
                        ))}
                      </div>
                    )}

                    {codingChallenge.constraints.length > 0 && (
                      <div>
                        <h4 className="font-['Syne'] font-bold text-gray-800 mb-2">Constraints:</h4>
                        <ul className="list-disc list-inside space-y-1">
                          {codingChallenge.constraints.map((constraint, idx) => (
                            <li key={idx} className="text-gray-700 text-sm font-['Syne']">{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="font-['Syne'] font-bold text-gray-800 mb-4">Your Solution</h3>
                  <textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    placeholder="Write your code here..."
                    className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-xl border-2 border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                  />
                </div>

                <button
                  onClick={handleCodingSubmit}
                  disabled={submitting || !userCode.trim()}
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-['Syne'] font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Evaluating...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Solution
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterTest;
