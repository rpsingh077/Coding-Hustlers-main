import { useState, useEffect } from 'react';
import { FileText, ChevronDown, ChevronLeft, ChevronRight, CreditCard as Edit, Calendar, CheckCircle2, XCircle, Clock, Code, Check, X, User, Mail, LogOut, Bug, FileCode } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { type Test } from '../lib/localStorage';
import { getTestStats, subscribeToUserTests } from '../services/firestore';
import Sidebar, { MobileSidebarToggle } from '../components/Sidebar';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    passed: 0,
    failed: 0,
    pending: 0,
    avgScore: 0
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const testsPerPage = 2;

  const userName = currentUser?.displayName || 'User';

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = subscribeToUserTests(currentUser.uid, (tests) => {
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

      setTests(uniqueTests);

      const completed = uniqueTests.filter((t: Test) => t.status === 'completed');
      const passed = completed.filter((t: Test) => t.score >= t.max_score * 0.6);
      const failed = completed.filter((t: Test) => t.score < t.max_score * 0.6);
      const pending = uniqueTests.filter((t: Test) => t.status === 'pending_result');

      const avgScore = completed.length > 0
        ? Math.round(completed.reduce((sum: number, t: Test) => sum + (t.score / t.max_score) * 100, 0) / completed.length)
        : 0;

      setStats({
        totalTests: uniqueTests.length,
        passed: passed.length,
        failed: failed.length,
        pending: pending.length,
        avgScore,
      });
    });

    return () => unsubscribe();
  }, [currentUser]);

  const paginatedTests = tests.slice(currentPage * testsPerPage, (currentPage + 1) * testsPerPage);
  const maxPages = Math.ceil(tests.length / testsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < maxPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const { logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
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
            <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8 lg:mb-12 gap-4">
              <div>
                <h2 className="text-3xl lg:text-5xl font-bold font-['Syne'] text-black mb-1">
                  Welcome {userName}!
                </h2>
              </div>

              <div className="flex items-center gap-3 lg:gap-6 w-full lg:w-auto justify-end">
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-2 lg:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold shadow-lg">
                      {userName[0]?.toUpperCase()}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-black transition-transform ${
                      showProfileDropdown ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {showProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            {userName[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-['Syne'] font-bold text-white text-lg truncate">
                              {currentUser?.displayName || 'User'}
                            </h3>
                            <p className="font-['Syne'] text-white/90 text-sm truncate">
                              {currentUser?.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-3">
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileDropdown(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <User className="w-5 h-5 text-gray-600 group-hover:text-purple-600 transition-colors" />
                          <span className="font-['Syne'] font-medium text-gray-700 group-hover:text-purple-600 transition-colors">
                            View Profile
                          </span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group"
                        >
                          <LogOut className="w-5 h-5 text-gray-600 group-hover:text-red-600 transition-colors" />
                          <span className="font-['Syne'] font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                            Log Out
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-[rgba(250,250,250,0.75)] rounded-xl p-6 hover:bg-white/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-['Poppins'] font-bold text-black/80 mb-1">{stats.totalTests}</p>
                <p className="text-sm font-['Syne'] text-black/50">Total Tests Given</p>
              </div>

              <div className="bg-[rgba(250,250,250,0.75)] rounded-xl p-6 hover:bg-white/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                </div>
                <p className="text-3xl font-['Poppins'] font-bold text-black/80 mb-1">{stats.passed}</p>
                <p className="text-sm font-['Syne'] text-black/50">Passed Tests</p>
              </div>

              <div className="bg-[rgba(250,250,250,0.75)] rounded-xl p-6 hover:bg-white/50 transition-colors">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
                    <X className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                </div>
                <p className="text-3xl font-['Poppins'] font-bold text-black/80 mb-1">{stats.failed}</p>
                <p className="text-sm font-['Syne'] text-black/50">Failed Tests</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold font-['Syne'] text-black flex items-center gap-3">
                    <FileText className="w-6 h-6" style={{ stroke: 'url(#gradient3)' }} />
                    <svg width="0" height="0">
                      <defs>
                        <linearGradient id="gradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#F187FB" />
                          <stop offset="100%" stopColor="#439CFB" />
                        </linearGradient>
                      </defs>
                    </svg>
                    Recent Tests
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5 text-black" />
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= maxPages - 1 || tests.length === 0}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5 text-black" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {paginatedTests.length > 0 ? (
                    paginatedTests.map((test) => {
                      const isPassed = test.status === 'completed' && test.score >= test.max_score * 0.6;
                      const isFailed = test.status === 'completed' && test.score < test.max_score * 0.6;
                      const scorePercentage = test.status === 'completed' ? Math.round((test.score / test.max_score) * 100) : 0;

                      return (
                        <div
                          key={test.id}
                          className="group relative bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border border-white/40 overflow-hidden"
                          style={{
                            background: test.status === 'completed'
                              ? isPassed
                                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.6) 100%)'
                                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.6) 100%)'
                              : 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(255, 255, 255, 0.7) 50%, rgba(255, 255, 255, 0.6) 100%)'
                          }}
                        >
                          <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${
                            test.status === 'completed'
                              ? isPassed ? 'bg-green-400' : 'bg-red-400'
                              : 'bg-purple-400'
                          }`}></div>

                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-5">
                              <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                  test.type === 'mcq'
                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                    : test.type === 'debug'
                                    ? 'bg-gradient-to-br from-orange-500 to-red-500'
                                    : test.type === 'pseudocode'
                                    ? 'bg-gradient-to-br from-teal-500 to-green-500'
                                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                }`}>
                                  {test.type === 'mcq' ? (
                                    <Edit className="w-6 h-6 text-white" />
                                  ) : test.type === 'debug' ? (
                                    <Bug className="w-6 h-6 text-white" />
                                  ) : test.type === 'pseudocode' ? (
                                    <FileCode className="w-6 h-6 text-white" />
                                  ) : (
                                    <Code className="w-6 h-6 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className={`px-3 py-1 rounded-lg text-xs font-bold font-['Poppins'] tracking-wider ${
                                    test.type === 'mcq'
                                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                                      : test.type === 'debug'
                                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                      : test.type === 'pseudocode'
                                      ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white'
                                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                                  }`}>
                                    {test.type === 'mcq' ? 'MCQ TEST' : test.type === 'debug' ? 'DEBUG' : test.type === 'pseudocode' ? 'PSEUDOCODE' : 'CODING'}
                                  </div>
                                </div>
                              </div>

                              {test.status === 'completed' && (
                                <div className="relative">
                                  <svg className="w-16 h-16 transform -rotate-90">
                                    <circle
                                      cx="32"
                                      cy="32"
                                      r="28"
                                      stroke={isPassed ? '#10B981' : '#EF4444'}
                                      strokeWidth="4"
                                      fill="none"
                                      opacity="0.2"
                                    />
                                    <circle
                                      cx="32"
                                      cy="32"
                                      r="28"
                                      stroke={isPassed ? '#10B981' : '#EF4444'}
                                      strokeWidth="4"
                                      fill="none"
                                      strokeDasharray={`${2 * Math.PI * 28}`}
                                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - scorePercentage / 100)}`}
                                      strokeLinecap="round"
                                      className="transition-all duration-1000 ease-out"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-base font-bold font-['Poppins'] ${
                                      isPassed ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {scorePercentage}%
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>

                            <h4 className="font-['Syne'] font-bold text-gray-800 text-lg mb-4 leading-snug min-h-[3.5rem] line-clamp-2">
                              {test.title}
                            </h4>

                            <div className="flex items-center gap-2 mb-5">
                              {test.status === 'in_progress' && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm font-semibold font-['Poppins'] rounded-xl shadow-md">
                                  <Clock className="w-4 h-4" />
                                  In Progress
                                </div>
                              )}
                              {test.status === 'completed' && (
                                <div className={`flex items-center gap-2 px-4 py-2 ${
                                  isPassed
                                    ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                    : 'bg-gradient-to-r from-red-400 to-rose-500'
                                } text-white text-sm font-semibold font-['Poppins'] rounded-xl shadow-md`}>
                                  {isPassed ? (
                                    <>
                                      <CheckCircle2 className="w-4 h-4" />
                                      Passed
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-4 h-4" />
                                      Failed
                                    </>
                                  )}
                                </div>
                              )}
                              {test.status === 'pending_result' && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400 to-indigo-500 text-white text-sm font-semibold font-['Poppins'] rounded-xl shadow-md">
                                  <Clock className="w-4 h-4" />
                                  Pending Result
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
                              <div className="flex items-center gap-2 text-sm text-gray-600 font-medium font-['Syne']">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                  <Calendar className="w-4 h-4 text-gray-600" />
                                </div>
                                <span>{new Date(test.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                              {test.status === 'completed' && (
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                                  <CheckCircle2 className={`w-4 h-4 ${isPassed ? 'text-green-600' : 'text-red-600'}`} />
                                  <span className="text-sm font-bold text-gray-700 font-['Poppins']">
                                    {test.score}/{test.max_score}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-center py-16">
                      <div className="mb-4">
                        <div className="w-20 h-20 mx-auto bg-[#F3E8FF] rounded-full flex items-center justify-center mb-4">
                          <FileText className="w-10 h-10 text-[#B33DEB]" />
                        </div>
                        <p className="text-gray-600 font-['Syne'] text-lg mb-2">No tests yet</p>
                        <p className="text-gray-400 font-['Syne'] text-sm mb-6">Start your learning journey today!</p>
                      </div>
                      <Link
                        to="/tests"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] text-white rounded-xl font-['Syne'] font-semibold hover:opacity-90 transition-opacity"
                      >
                        Take Your First Test
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4">
                <div className="bg-[rgba(250,250,250,0.75)] rounded-xl p-6">
                  <h3 className="text-lg font-bold font-['Syne'] text-black mb-6">Statistics Overview</h3>
                  <div className="space-y-5">
                    <div className="flex items-center gap-4 hover:bg-white/30 p-3 rounded-lg transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent font-bold">%</span>
                      </div>
                      <div>
                        <p className="text-2xl font-['Poppins'] font-bold text-black/80">{stats.avgScore}%</p>
                        <p className="text-xs font-['Syne'] text-black/50">Average Score</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 hover:bg-white/30 p-3 rounded-lg transition-colors">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">⏳</span>
                      </div>
                      <div>
                        <p className="text-2xl font-['Poppins'] font-bold text-black/80">{stats.pending}</p>
                        <p className="text-xs font-['Syne'] text-black/50">Pending Results</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-['Syne'] text-black/60">Pass Rate</span>
                        <span className="text-sm font-['Syne'] font-bold text-black/80">
                          {stats.totalTests > 0 ? Math.round((stats.passed / stats.totalTests) * 100) : 0}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all"
                          style={{ width: `${stats.totalTests > 0 ? (stats.passed / stats.totalTests) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
      </div>
    </div>
  );
};

export default Dashboard;
