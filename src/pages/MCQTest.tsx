import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateTestQuestions } from '../lib/gemini';
import { saveTestToFirestore, updateTestInFirestore, saveQuestionsToFirestore, updateQuestionInFirestore } from '../services/firestore';

interface Question {
  question: string;
  options: { [key: string]: string };
  correct_answer: string;
  explanation: string;
}

const MCQTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { topic, difficulty } = location.state || {};

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(1800);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!topic || !difficulty) {
      navigate('/tests');
      return;
    }

    loadQuestions();
  }, []);

  useEffect(() => {
    if (!loading && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, showResults]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const generatedQuestions = await generateTestQuestions(topic, difficulty, 10);
      setQuestions(generatedQuestions);

      const testId = await saveTestToFirestore({
        user_id: currentUser?.uid || 'anonymous',
        title: `${topic} - MCQ Test`,
        type: 'mcq',
        difficulty,
        total_questions: generatedQuestions.length,
        max_score: generatedQuestions.length,
        score: 0,
        status: 'in_progress',
        completed_at: null
      });

      setTestId(testId);

      const questionsData = generatedQuestions.map((q: Question) => ({
        test_id: testId,
        question: q.question,
        options: q.options,
        correct_answer: q.correct_answer,
        points: 1
      }));

      await saveQuestionsToFirestore(questionsData);
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Failed to generate questions. Please try again.');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      setUserAnswers({ ...userAnswers, [currentQuestion]: selectedAnswer });
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitTest();
      }
    }
  };

  const handleSubmitTest = async () => {
    const finalAnswers = { ...userAnswers };
    if (selectedAnswer) {
      finalAnswers[currentQuestion] = selectedAnswer;
    }

    let calculatedScore = 0;
    questions.forEach((q, index) => {
      if (finalAnswers[index] === q.correct_answer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    setShowResults(true);

    if (testId) {
      await updateTestInFirestore(testId, {
        score: calculatedScore,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      for (const [index, q] of questions.entries()) {
        const userAnswer = finalAnswers[index];
        const isCorrect = userAnswer === q.correct_answer;

        await updateQuestionInFirestore(testId, q.question, {
          user_answer: userAnswer,
          is_correct: isCorrect
        });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-['Syne'] text-lg">Generating your test...</p>
        </div>
      </div>
    );
  }

  if (showResults) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;

    return (
      <div className="min-h-screen flex items-center justify-center p-8" style={{
        background: `
          radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
          radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
          radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
          radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
          #F5F5F5
        `
      }}>
        <div className="bg-white rounded-2xl p-12 max-w-2xl w-full text-center shadow-2xl">
          <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            <span className="text-6xl">{passed ? '🎉' : '😔'}</span>
          </div>

          <h2 className="text-4xl font-bold font-['Syne'] text-black mb-4">
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>

          <p className="text-gray-600 font-['Syne'] mb-8">
            You scored <span className="font-bold text-2xl text-purple-600">{score}/{questions.length}</span> ({percentage}%)
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 font-['Syne']">Correct</p>
              <p className="text-2xl font-bold text-green-600">{score}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 font-['Syne']">Wrong</p>
              <p className="text-2xl font-bold text-red-600">{questions.length - score}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-600 font-['Syne']">Total</p>
              <p className="text-2xl font-bold text-gray-800">{questions.length}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-xl font-['Syne'] text-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8" style={{
      background: `
        radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
        radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
        radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
        radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
        #F5F5F5
      `
    }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div className="flex-1">
            <h1 className="text-xl lg:text-3xl font-bold font-['Syne'] text-black">{topic} - MCQ Test</h1>
            <p className="text-sm lg:text-base text-gray-600 font-['Syne']">Question {currentQuestion + 1} of {questions.length}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl shadow-lg">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              <span className={`font-['Syne'] font-bold text-sm lg:text-base ${timeLeft < 60 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 lg:p-8 shadow-xl mb-6">
          <div className="mb-2">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-lg lg:text-2xl font-bold font-['Syne'] text-black mb-6 lg:mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {Object.entries(questions[currentQuestion].options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswerSelect(key)}
                className={`w-full text-left p-4 lg:p-6 rounded-xl border-2 transition-all font-['Syne'] text-sm lg:text-base ${
                  selectedAnswer === key
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-purple-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === key
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswer === key && <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-white" />}
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 mr-2">{key}.</span>
                    <span className="text-gray-800">{value}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer}
            className="px-6 lg:px-8 py-3 lg:py-4 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-xl font-['Syne'] text-base lg:text-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Test' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MCQTest;
