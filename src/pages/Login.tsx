import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to log in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2" style={{
      background: `
        radial-gradient(circle at 78% 30%, rgba(255, 228, 196, 0.3) 0%, transparent 100%),
        radial-gradient(circle at 55% 90%, rgba(140, 188, 254, 0.4) 0%, transparent 100%),
        radial-gradient(circle at 0% 0%, rgba(142, 73, 255, 0.5) 0%, transparent 100%),
        radial-gradient(circle at 100% 100%, rgba(251, 255, 73, 0.3) 0%, transparent 100%),
        #F5F5F5
      `
    }}>
      {/* Left Side - Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 relative">
        <div className="absolute top-12 left-12">
          <span className="text-4xl font-bold font-['Syne']">
            <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">Coding </span>
            <span className="text-gray-400">Hustlers</span>
          </span>
        </div>

        <div className="relative z-10 flex items-center justify-center">
          <div className="absolute top-0 right-20 w-32 h-32 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full opacity-60 blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full opacity-60 blur-3xl"></div>
          <img
            src="/hero-person.png"
            alt="Coding Hustlers"
            className="w-full max-w-lg drop-shadow-2xl"
          />
        </div>

        <div className="text-center">
          <p className="text-gray-600 font-['Syne']">Join the coding revolution</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold font-['Syne'] mb-2">
              <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">Coding </span>
              <span className="text-gray-400">Hustlers</span>
            </h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-['Syne']">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email Id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors font-['Syne'] text-gray-700"
                required
                disabled={loading}
              />
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors font-['Syne'] text-gray-700"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] hover:opacity-90 text-white py-4 rounded-xl font-['Syne'] text-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex justify-between items-center mt-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-gray-600 font-['Syne']">
              Forget Password?
            </a>
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Syne'] font-semibold hover:opacity-80"
            >
              Sign Up
            </button>
          </div>

          <div className="mt-8">
            <p className="text-center text-gray-400 font-['Syne'] text-sm mb-6">
              Or you can Signup with
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={handleGoogleLogin}
                className="p-4 bg-white border-2 border-gray-200 rounded-full hover:border-purple-300 hover:shadow-md transition-all"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-400 font-['Syne']">
            This site is protected by reCAPTCHA and the Google{' '}
            <a href="#" className="underline hover:text-gray-600">Privacy Policy</a> and{' '}
            <a href="#" className="underline hover:text-gray-600">Terms of Service</a> apply.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
