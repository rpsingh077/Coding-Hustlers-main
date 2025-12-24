import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Clock, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generatePseudocodeProblem, evaluatePseudocode } from '../lib/gemini';
import { saveTestToFirestore, updateTestInFirestore, saveQuestionsToFirestore, updateQuestionInFirestore } from '../services/firestore';

interface PseudocodeProblem {
  title: string;
  description: string;
  requirements: string[];
  examples: Array<{ scenario: string; expectedApproach: string }>;
  evaluationCriteria: string[];
}

const PseudocodeTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { topic, difficulty } = location.state || {};

  const [problem, setProblem] = useState<PseudocodeProblem | null>(null);
  const [pseudocode, setPseudocode] = useState('');
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
      const generatedProblem = await generatePseudocodeProblem(topic, difficulty);
      setProblem(generatedProblem);

      const testId = await saveTestToFirestore({
        user_id: currentUser?.uid || 'anonymous',
        title: `${topic} - Pseudocode Test`,
        type: 'pseudocode',
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
        correct_answer: 'Algorithmic pseudocode solution',
        points: 100
      }]);
    } catch (error) {
      console.error('Error loading pseudocode problem:', error);
      alert('Failed to generate pseudocode problem. Please try again.');
      navigate('/tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!problem || !testId || !pseudocode.trim()) {
      alert('Please write your pseudocode solution before submitting.');
      return;
    }

    try {
      setEvaluating(true);
      const evaluation = await evaluatePseudocode(problem.description, problem.requirements, pseudocode);
      setResult(evaluation);
      setShowResults(true);

      await updateTestInFirestore(testId, {
        score: evaluation.score,
        status: 'completed',
        completed_at: new Date().toISOString()
      });

      await updateQuestionInFirestore(testId, problem.description, {
        user_answer: pseudocode,
        is_correct: evaluation.score >= 60
      });
    } catch (error) {
      console.error('Error evaluating pseudocode:', error);
      alert('Failed to evaluate pseudocode. Please try again.');
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
          <p className="text-gray-600 font-['Syne'] text-lg">Generating your pseudocode challenge...</p>
        </div>
      </div>
    );
  }

  if (showResults && result) {
    const passed = result.score >= 60;

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
            passed ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <span className="text-6xl">{passed ? '🎯' : '📝'}</span>
          </div>

          <h2 className="text-4xl font-bold font-['Syne'] text-black mb-4 text-center">
            {passed ? 'Great Logic!' : 'Good Attempt!'}
          </h2>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-lg font-bold text-purple-600 mb-4">Score: {result.score}/100</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Logic Correct</p>
                <p className="text-lg font-bold">{result.logicCorrect ? '✓ Yes' : '✗ No'}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-1">Edge Cases</p>
                <p className="text-lg font-bold">{result.edgeCasesHandled ? '✓ Yes' : '✗ No'}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Clarity Score</p>
              <p className="text-lg font-bold">{result.clarityScore}/10</p>
            </div>

            <p className="text-gray-700 font-['Syne'] mb-4">{result.feedback}</p>

            {result.strengths && result.strengths.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-green-700 mb-2">Strengths:</h4>
                <ul className="space-y-1">
                  {result.strengths.map((strength: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.improvements && result.improvements.length > 0 && (
              <div>
                <h4 className="font-bold text-orange-700 mb-2">Areas for Improvement:</h4>
                <ul className="space-y-1">
                  {result.improvements.map((improvement: string, index: number) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                      <span className="text-orange-600">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold font-['Syne']">PSEUDOCODE</span>
              <h1 className="text-xl lg:text-3xl font-bold font-['Syne'] text-black">{problem?.title || 'Pseudocode Challenge'}</h1>
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
            <p className="text-sm lg:text-base text-gray-700 font-['Syne'] mb-6 whitespace-pre-wrap">{problem?.description}</p>

            {problem?.requirements && problem.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Requirements:</h3>
                <ul className="space-y-2">
                  {problem.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-purple-600 font-bold">{index + 1}.</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {problem?.examples && problem.examples.length > 0 && (
              <div className="mb-6">
                <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Examples:</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className="font-semibold text-sm mb-2">Example {index + 1}:</p>
                    <p className="text-sm text-gray-700 mb-2"><strong>Scenario:</strong> {example.scenario}</p>
                    <p className="text-sm text-gray-600"><strong>Expected Approach:</strong> {example.expectedApproach}</p>
                  </div>
                ))}
              </div>
            )}

            {problem?.evaluationCriteria && problem.evaluationCriteria.length > 0 && (
              <div>
                <h3 className="font-bold font-['Syne'] text-base lg:text-lg mb-3">Evaluation Criteria:</h3>
                <ul className="space-y-2">
                  {problem.evaluationCriteria.map((criterion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600">✓</span>
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg lg:text-xl font-bold font-['Syne']">Write Your Pseudocode</h2>
                <p className="text-xs text-gray-600 mt-1">Describe your algorithm in plain English with logical steps</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={evaluating}
                className="flex items-center gap-2 px-4 lg:px-6 py-2 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-lg font-['Syne'] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm lg:text-base"
              >
                <Send className="w-4 h-4" />
                {evaluating ? 'Evaluating...' : 'Submit'}
              </button>
            </div>

            <textarea
              value={pseudocode}
              onChange={(e) => setPseudocode(e.target.value)}
              className="flex-1 p-3 lg:p-4 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none font-['Syne'] text-sm"
              placeholder="Example:&#10;&#10;1. Start with initializing variables...&#10;2. For each element in the input:&#10;   - Check if condition is met&#10;   - If yes, perform action A&#10;   - Otherwise, perform action B&#10;3. Return the final result&#10;&#10;Write your algorithm step by step in plain English..."
              spellCheck={false}
            />

            <div className="mt-4 bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-800 font-['Syne']">
                <strong>Tip:</strong> Focus on the logic and flow of your solution. Use clear, numbered steps. Consider edge cases and explain your reasoning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PseudocodeTest;
