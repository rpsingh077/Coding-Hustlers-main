import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Play, Lightbulb } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateDebugProblem, evaluateDebugCode } from '../lib/gemini';
import { saveTestToFirestore, updateTestInFirestore, saveQuestionsToFirestore, updateQuestionInFirestore } from '../services/firestore';

interface DebugProblem {
  title: string;
  description: string;
  buggyCode: string;
  language: string;
  hints: string[];
  expectedBehavior: string;
  testCases: Array<{ input: string; expectedOutput: string }>;
}

const DebugTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { topic, difficulty } = location.state || {};

  const [problem, setProblem] = useState<DebugProblem | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [showHints, setShowHints] = useState(false);

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
      const generatedProblem = await generateDebugProblem(topic, difficulty);
      setProblem(generatedProblem);
      setCode(generatedProblem.buggyCode);

      const testId = await saveTestToFirestore({
        user_id: currentUser?.uid || 'anonymous',
        title: `${topic} - Debug Challenge`,
        type: 'debug',
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
        correct_answer: 'Fixed code with bugs removed',
        points: 100
      }]);
    } catch (error) {
      console.error('Error loading debug problem:', error);
      alert('Failed to generate debug problem. Please try again.');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !testId) return;

    try {
      setEvaluating(true);
      const evaluation = await evaluateDebugCode(problem.buggyCode, code, problem.description, problem.testCases);
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
          <p className="text-gray-600 font-['Syne'] text-lg">Generating your debug challenge...</p>
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
            <span className="text-6xl">{result.passed ? '✅' : '🐛'}</span>
          </div>

          <h2 className="text-4xl font-bold font-['Syne'] text-black mb-4 text-center">
            {result.passed ? 'All Bugs Fixed!' : 'Some Bugs Remain'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-lg font-bold text-purple-600 mb-2">Score: {result.score}/100</p>
            <p className="text-sm text-gray-600 mb-2">Bugs Found: {result.bugsFound || 'N/A'}</p>
            <p className="text-gray-700 font-['Syne']">{result.feedback}</p>
          </div>

          {result.testResults && result.testResults.length > 0 && (
            <div className="space-y-4 mb-8">
              <h3 className="font-bold font-['Syne'] text-xl">Test Results:</h3>
              {result.testResults.map((test: any, index: number) => (
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
          )}

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
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold font-['Syne']">DEBUG</span>
              <h1 className="text-xl lg:text-3xl font-bold font-['Syne'] text-black">{problem?.title || 'Debug Challenge'}</h1>
            </div>
          </div>

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
            <p className="text-sm lg:text-base text-gray-700 font-['Syne'] mb-6">{problem?.description}</p>

            <div className="mb-6">
              <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Expected Behavior:</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-700">{problem?.expectedBehavior}</p>
              </div>
            </div>

            <div className="mb-6">
              <button
                onClick={() => setShowHints(!showHints)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors font-['Syne'] font-medium"
              >
                <Lightbulb className="w-5 h-5" />
                {showHints ? 'Hide Hints' : 'Show Hints'}
              </button>

              {showHints && problem?.hints && (
                <div className="mt-3 space-y-2">
                  {problem.hints.map((hint, index) => (
                    <div key={index} className="bg-yellow-50 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-bold">Hint {index + 1}:</span> {hint}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {problem?.testCases && problem.testCases.length > 0 && (
              <div>
                <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Test Cases:</h3>
                {problem.testCases.map((testCase, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="text-sm"><strong>Input:</strong> {testCase.input}</p>
                    <p className="text-sm"><strong>Expected Output:</strong> {testCase.expectedOutput}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg lg:text-xl font-bold font-['Syne']">Fix the Code</h2>
              <button
                onClick={handleSubmit}
                disabled={evaluating}
                className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm lg:text-base"
              >
                <Play className="w-4 h-4" />
                {evaluating ? 'Evaluating...' : 'Submit Fix'}
              </button>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 font-mono text-xs lg:text-sm p-3 lg:p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Fix the bugs in this code..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugTest;
