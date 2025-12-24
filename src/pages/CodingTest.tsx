import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateCodingProblem, evaluateCode } from '../lib/gemini';
import { saveTestToFirestore, updateTestInFirestore, saveQuestionsToFirestore, updateQuestionInFirestore } from '../services/firestore';

type SupportedLanguage = 'javascript' | 'python' | 'python3' | 'java' | 'c' | 'cpp' | 'csharp' | 'go' | 'rust' | 'kotlin';

interface CodingProblem {
  title: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation: string }>;
  constraints: string[];
  testCases: Array<{ input: string; expectedOutput: string }>;
  starterCode: Record<SupportedLanguage, string>;
}

const CodingTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { topic, difficulty } = location.state || {};

  const [problem, setProblem] = useState<CodingProblem | null>(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    if (!topic || !difficulty) {
      navigate('/tests');
      return;
    }

    loadProblem();
  }, []);

  useEffect(() => {
    if (!loading && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, showResults]);

  const loadProblem = async () => {
    try {
      setLoading(true);
      const generatedProblem = await generateCodingProblem(topic, difficulty);
      setProblem(generatedProblem);
      setCode(generatedProblem.starterCode.javascript);

      const testId = await saveTestToFirestore({
        user_id: currentUser?.uid || 'anonymous',
        title: `${topic} - Coding Challenge`,
        type: 'coding',
        difficulty,
        total_questions: 1,
        max_score: 100,
        score: 0,
        status: 'in_progress',
        completed_at: null
      });

      setTestId(testId);

      await saveQuestionsToFirestore([{
        test_id: testId,
        question: generatedProblem.description,
        options: generatedProblem,
        correct_answer: 'See test cases',
        points: 100
      }]);
    } catch (error) {
      console.error('Error loading problem:', error);
      alert('Failed to generate problem. Please try again.');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    if (problem) {
      setCode(problem.starterCode[newLang] || '');
    }
  };

  const cleanText = (text: string): string => {
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const languageOptions: Array<{ value: SupportedLanguage; label: string; color: string }> = [
    { value: 'javascript', label: 'JavaScript', color: 'bg-yellow-500' },
    { value: 'python', label: 'Python', color: 'bg-blue-500' },
    { value: 'python3', label: 'Python 3', color: 'bg-blue-600' },
    { value: 'java', label: 'Java', color: 'bg-red-500' },
    { value: 'c', label: 'C', color: 'bg-gray-600' },
    { value: 'cpp', label: 'C++', color: 'bg-blue-700' },
    { value: 'csharp', label: 'C#', color: 'bg-purple-600' },
    { value: 'go', label: 'Go', color: 'bg-cyan-500' },
    { value: 'rust', label: 'Rust', color: 'bg-orange-600' },
    { value: 'kotlin', label: 'Kotlin', color: 'bg-violet-500' },
  ];

  const handleSubmit = async () => {
    if (!problem || !testId) return;

    try {
      setEvaluating(true);
      const evaluation = await evaluateCode(code, problem.description, problem.testCases);
      setResult(evaluation);
      setShowResults(true);

      await updateTestInFirestore(testId, {
        score: evaluation.score,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      await updateQuestionInFirestore(testId, problem.description, {
        user_answer: code,
        is_correct: evaluation.passed
      });
    } catch (error) {
      console.error('Error evaluating code:', error);
      alert('Failed to evaluate code. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
          <p className="text-gray-600 font-['Syne'] text-lg">Generating your coding challenge...</p>
        </div>
      </div>
    );
  }

  if (showResults && result) {
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
        <div className="bg-white rounded-2xl p-12 max-w-3xl w-full shadow-2xl">
          <div className={`w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center ${
            result.passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <span className="text-6xl">{result.passed ? '✅' : '⚠️'}</span>
          </div>

          <h2 className="text-4xl font-bold font-['Syne'] text-black mb-4 text-center">
            {result.passed ? 'All Tests Passed!' : 'Some Tests Failed'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-lg font-bold text-purple-600 mb-2">Score: {result.score}/100</p>
            <p className="text-gray-700 font-['Syne']">{result.feedback}</p>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="font-bold font-['Syne'] text-xl">Test Results:</h3>
            {result.testResults?.map((test: any, index: number) => (
              <div key={index} className={`p-4 rounded-lg ${test.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-semibold">Test {index + 1}: {test.passed ? '✓ Passed' : '✗ Failed'}</p>
                {!test.passed && (
                  <div className="text-sm mt-2">
                    <p>Expected: {test.expected}</p>
                    <p>Got: {test.actual}</p>
                  </div>
                )}
              </div>
            ))}
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
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 lg:mb-6 gap-4">
          <h1 className="text-xl lg:text-3xl font-bold font-['Syne'] text-black">{problem?.title || 'Coding Challenge'}</h1>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white px-4 lg:px-6 py-2 lg:py-3 rounded-xl shadow-lg">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-purple-600" />
              <span className={`font-['Syne'] font-bold text-sm lg:text-base ${timeLeft < 300 ? 'text-red-600' : 'text-gray-800'}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl overflow-y-auto max-h-[400px] lg:max-h-[calc(100vh-200px)]">
            <h2 className="text-lg lg:text-2xl font-bold font-['Syne'] mb-4">Problem Description</h2>
            <p className="text-sm lg:text-base text-gray-700 font-['Syne'] mb-6 whitespace-pre-wrap">{problem?.description ? cleanText(problem.description) : ''}</p>

            {problem?.examples && problem.examples.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Examples:</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="font-semibold">Example {index + 1}:</p>
                    <p className="text-sm mt-2"><strong>Input:</strong> {cleanText(example.input)}</p>
                    <p className="text-sm"><strong>Output:</strong> {cleanText(example.output)}</p>
                    {example.explanation && <p className="text-sm text-gray-600 mt-1">{cleanText(example.explanation)}</p>}
                  </div>
                ))}
              </div>
            )}

            {problem?.constraints && problem.constraints.length > 0 && (
              <div>
                <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Constraints:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="text-gray-700 text-sm">{cleanText(constraint)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((langOption) => (
                  <button
                    key={langOption.value}
                    onClick={() => handleLanguageChange(langOption.value)}
                    className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg font-['Syne'] font-medium transition-all text-xs lg:text-sm ${
                      language === langOption.value
                        ? `${langOption.color} text-white shadow-lg scale-105`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {langOption.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-end">

                <button
                  onClick={handleSubmit}
                  disabled={evaluating}
                  className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm lg:text-base"
                >
                  <Play className="w-4 h-4" />
                  {evaluating ? 'Evaluating...' : 'Submit Code'}
                </button>
              </div>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 font-mono text-xs lg:text-sm p-3 lg:p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Write your code here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;
