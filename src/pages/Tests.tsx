import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, List, Bug, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar, { MobileSidebarToggle } from '../components/Sidebar';

const Tests = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'mcq' | 'coding' | 'debug' | 'pseudocode' | null>(null);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [showTopicDropdown, setShowTopicDropdown] = useState(false);

  const topicOptions = {
    beginner: [
      'HTML & CSS Basics',
      'JavaScript Fundamentals',
      'Python Basics',
      'Git & Version Control',
      'SQL Fundamentals'
    ],
    intermediate: [
      'React.js',
      'Node.js & Express',
      'RESTful APIs',
      'Data Structures',
      'Algorithms',
      'Object-Oriented Programming'
    ],
    advanced: [
      'System Design',
      'Microservices Architecture',
      'Advanced Algorithms',
      'Machine Learning',
      'Cloud Computing (AWS/Azure)',
      'DevOps & CI/CD'
    ]
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const handleStartTest = () => {
    if (!topic || !selectedType) {
      alert('Please select a test type and enter a topic');
      return;
    }

    let testUrl = '';
    if (selectedType === 'mcq') testUrl = '/test/mcq';
    else if (selectedType === 'coding') testUrl = '/test/coding';
    else if (selectedType === 'debug') testUrl = '/test/debug';
    else if (selectedType === 'pseudocode') testUrl = '/test/pseudocode';
    navigate(testUrl, { state: { topic, difficulty } });
  };

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
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl lg:text-5xl font-bold font-['Syne'] text-black mb-6 lg:mb-8">
                Start a New Test
              </h2>

              <div className="bg-[rgba(250,250,250,0.75)] rounded-2xl p-6 lg:p-8 mb-8">
                <h3 className="text-xl lg:text-2xl font-bold font-['Syne'] text-black mb-6">Select Test Type</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mb-8">
                  <button
                    onClick={() => setSelectedType('mcq')}
                    className={`p-6 lg:p-8 rounded-xl border-2 transition-all ${
                      selectedType === 'mcq'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    }`}
                  >
                    <List className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-purple-600" />
                    <h4 className="text-lg lg:text-xl font-bold font-['Syne'] text-black mb-2">Multiple Choice</h4>
                    <p className="text-xs lg:text-sm text-gray-600 font-['Syne']">
                      Test your knowledge with AI-generated MCQ questions
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedType('coding')}
                    className={`p-6 lg:p-8 rounded-xl border-2 transition-all ${
                      selectedType === 'coding'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    }`}
                  >
                    <Code className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-purple-600" />
                    <h4 className="text-lg lg:text-xl font-bold font-['Syne'] text-black mb-2">Coding Challenge</h4>
                    <p className="text-xs lg:text-sm text-gray-600 font-['Syne']">
                      Solve coding problems and test your programming skills
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedType('debug')}
                    className={`p-6 lg:p-8 rounded-xl border-2 transition-all ${
                      selectedType === 'debug'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    }`}
                  >
                    <Bug className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-purple-600" />
                    <h4 className="text-lg lg:text-xl font-bold font-['Syne'] text-black mb-2">Debug Challenge</h4>
                    <p className="text-xs lg:text-sm text-gray-600 font-['Syne']">
                      Find and fix bugs in existing code
                    </p>
                  </button>

                  <button
                    onClick={() => setSelectedType('pseudocode')}
                    className={`p-6 lg:p-8 rounded-xl border-2 transition-all ${
                      selectedType === 'pseudocode'
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-purple-300'
                    }`}
                  >
                    <FileText className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 text-purple-600" />
                    <h4 className="text-lg lg:text-xl font-bold font-['Syne'] text-black mb-2">Pseudocode Test</h4>
                    <p className="text-xs lg:text-sm text-gray-600 font-['Syne']">
                      Write algorithmic solutions in plain English with logic
                    </p>
                  </button>
                </div>

                {selectedType && (
                  <div className="space-y-4 lg:space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                        Topic
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={topic}
                          onChange={(e) => setTopic(e.target.value)}
                          onFocus={() => setShowTopicDropdown(true)}
                          placeholder="e.g., JavaScript, Python, Data Structures"
                          className="w-full px-4 lg:px-6 py-3 lg:py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors font-['Syne'] text-gray-700 text-sm lg:text-base pr-10"
                        />
                        <button
                          onClick={() => setShowTopicDropdown(!showTopicDropdown)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>

                      {showTopicDropdown && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-96 overflow-y-auto">
                          <div className="p-2">
                            <div className="mb-4">
                              <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 rounded-lg mb-2">
                                <h4 className="font-bold font-['Syne'] text-green-700 text-sm">Beginner</h4>
                              </div>
                              {topicOptions.beginner.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    setTopic(opt);
                                    setShowTopicDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors font-['Syne'] text-sm text-gray-700"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            <div className="mb-4">
                              <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg mb-2">
                                <h4 className="font-bold font-['Syne'] text-blue-700 text-sm">Intermediate</h4>
                              </div>
                              {topicOptions.intermediate.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    setTopic(opt);
                                    setShowTopicDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors font-['Syne'] text-sm text-gray-700"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            <div>
                              <div className="px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 rounded-lg mb-2">
                                <h4 className="font-bold font-['Syne'] text-red-700 text-sm">Advanced</h4>
                              </div>
                              {topicOptions.advanced.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => {
                                    setTopic(opt);
                                    setShowTopicDropdown(false);
                                  }}
                                  className="w-full text-left px-4 py-2 hover:bg-purple-50 rounded-lg transition-colors font-['Syne'] text-sm text-gray-700"
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 font-['Syne'] mb-2">
                        Difficulty Level
                      </label>
                      <div className="grid grid-cols-3 gap-2 lg:gap-4">
                        {(['easy', 'medium', 'hard'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setDifficulty(level)}
                            className={`px-4 lg:px-6 py-2 lg:py-3 rounded-xl border-2 transition-all font-['Syne'] font-medium capitalize text-sm lg:text-base ${
                              difficulty === level
                                ? 'border-purple-500 bg-purple-50 text-purple-700'
                                : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleStartTest}
                      className="w-full py-4 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-xl font-['Syne'] text-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Start Test
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
      </div>
    </div>
  );
};

export default Tests;
