import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, CreditCard as Edit, User, Settings, LogOut, X, Menu, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white/80 backdrop-blur-md p-6 lg:p-8 flex flex-col justify-between border-r border-gray-300 z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-12 lg:mb-16">
            <h1 className="text-3xl lg:text-4xl font-bold font-['Syne']">
              <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
                Coding Hustlers
              </span>
            </h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-700" />
            </button>
          </div>

          <nav className="space-y-5 lg:space-y-7">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-4 lg:gap-5 text-base lg:text-lg font-['Syne'] font-medium transition-colors group"
            >
              <div className={`${isActive('/dashboard') ? 'text-[#B33DEB]' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <span className={`${isActive('/dashboard') ? 'text-transparent bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                Dashboard
              </span>
            </Link>

            <Link
              to="/courses"
              onClick={onClose}
              className="flex items-center gap-4 lg:gap-5 text-base lg:text-lg font-['Syne'] font-medium transition-colors group"
            >
              <div className={`${isActive('/courses') ? 'text-[#B33DEB]' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                <BookOpen className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <span className={`${isActive('/courses') ? 'text-transparent bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                Courses
              </span>
            </Link>

            <Link
              to="/tests"
              onClick={onClose}
              className="flex items-center gap-4 lg:gap-5 text-base lg:text-lg font-['Syne'] font-medium transition-colors group"
            >
              <div className={`${isActive('/tests') ? 'text-[#B33DEB]' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                <Edit className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <span className={`${isActive('/tests') ? 'text-transparent bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                Tests
              </span>
            </Link>

            <Link
              to="/profile"
              onClick={onClose}
              className="flex items-center gap-4 lg:gap-5 text-base lg:text-lg font-['Syne'] font-medium transition-colors group"
            >
              <div className={`${isActive('/profile') ? 'text-[#B33DEB]' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                <User className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
              </div>
              <span className={`${isActive('/profile') ? 'text-transparent bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text' : 'text-black group-hover:text-purple-600'} transition-colors`}>
                Profile
              </span>
            </Link>
          </nav>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <Link
            to="/settings"
            onClick={onClose}
            className="flex items-center gap-4 lg:gap-5 text-base lg:text-lg font-['Syne'] font-medium transition-colors group"
          >
            <div className={`${isActive('/settings') ? 'text-[#B33DEB]' : 'text-black group-hover:text-purple-600'} transition-colors`}>
              <Settings className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
            </div>
            <span className={`${isActive('/settings') ? 'text-transparent bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text' : 'text-black group-hover:text-purple-600'} transition-colors`}>
              Settings
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 lg:gap-5 text-base lg:text-lg font-['Syne'] font-medium text-black hover:text-purple-600 transition-colors group"
          >
            <div className="text-black group-hover:text-purple-600 transition-colors">
              <LogOut className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={2} />
            </div>
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export const MobileSidebarToggle = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="lg:hidden fixed top-4 left-4 z-30 p-3 bg-white/80 backdrop-blur-md rounded-lg shadow-lg hover:bg-white transition-colors"
    >
      <Menu className="w-6 h-6 text-gray-700" />
    </button>
  );
};

export default Sidebar;
