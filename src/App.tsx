import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Tests from './pages/Tests';
import MCQTest from './pages/MCQTest';
import CodingTest from './pages/CodingTest';
import DebugTest from './pages/DebugTest';
import PseudocodeTest from './pages/PseudocodeTest';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import ChapterTest from './pages/ChapterTest';
import About from './pages/About';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tests"
            element={
              <ProtectedRoute>
                <Tests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/mcq"
            element={
              <ProtectedRoute>
                <MCQTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/coding"
            element={
              <ProtectedRoute>
                <CodingTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/debug"
            element={
              <ProtectedRoute>
                <DebugTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/test/pseudocode"
            element={
              <ProtectedRoute>
                <PseudocodeTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses"
            element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId"
            element={
              <ProtectedRoute>
                <CourseDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/course/:courseId/chapter/:chapterId"
            element={
              <ProtectedRoute>
                <ChapterTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
