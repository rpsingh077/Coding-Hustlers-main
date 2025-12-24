import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-2xl md:text-3xl font-bold font-['Syne']">
              <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">Coding Hustlers</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-12">
            <a href="#practice" className="text-gray-700 hover:text-purple-600 transition-colors font-['Syne'] text-lg">
              Practice
            </a>
            <a href="#explore" className="text-gray-700 hover:text-purple-600 transition-colors font-['Syne'] text-lg">
              Explore
            </a>
            <button onClick={() => navigate('/about')} className="text-gray-700 hover:text-purple-600 transition-colors font-['Syne'] text-lg">
              About
            </button>
            <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Syne'] text-lg hover:opacity-80">
              Login
            </button>
            <button onClick={() => navigate('/signup')} className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] hover:opacity-90 text-white px-6 py-3 rounded-full transition-all font-['Syne'] text-lg">
              Sign Up
            </button>
          </nav>

          <button
            className="md:hidden text-gray-700 hover:text-purple-600 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity md:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div
          className={`fixed right-0 top-0 bottom-0 w-64 bg-white shadow-xl transform transition-transform ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <span className="text-xl font-bold font-['Syne'] bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
              Menu
            </span>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-700">
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-col p-6 gap-6">
            <a
              href="#practice"
              className="text-gray-700 hover:text-purple-600 transition-colors font-['Syne'] text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Practice
            </a>
            <a
              href="#explore"
              className="text-gray-700 hover:text-purple-600 transition-colors font-['Syne'] text-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore
            </a>
            <button
              onClick={() => { navigate('/about'); setIsMobileMenuOpen(false); }}
              className="text-gray-700 hover:text-purple-600 transition-colors font-['Syne'] text-lg text-left"
            >
              About
            </button>
            <button
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
              className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Syne'] text-lg text-left"
            >
              Login
            </button>
            <button onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }} className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] hover:opacity-90 text-white px-6 py-3 rounded-full transition-all font-['Syne'] text-lg">
              Sign Up
            </button>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Header;
