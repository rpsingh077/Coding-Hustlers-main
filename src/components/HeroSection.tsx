import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen pt-32 pb-16 overflow-hidden" style={{
      background: `
        radial-gradient(circle at 78% 30%, rgba(255, 228, 196, 0.3) 0%, transparent 100%),
        radial-gradient(circle at 55% 90%, rgba(140, 188, 254, 0.4) 0%, transparent 100%),
        radial-gradient(circle at 0% 0%, rgba(142, 73, 255, 0.5) 0%, transparent 100%),
        radial-gradient(circle at 100% 100%, rgba(251, 255, 73, 0.3) 0%, transparent 100%),
        #F5F5F5
      `
    }}>
      <div className="absolute inset-0 bg-[rgba(245,245,245,0.65)] backdrop-blur-sm"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center min-h-[calc(100vh-8rem)]">
        <div className="space-y-6 md:space-y-8">
          <div className="inline-block mb-4 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full border-2 border-white/40">
            <span className="text-sm lg:text-base font-semibold font-['Syne'] bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
              Master Programming Today
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-tight font-['Syne']">
            <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">Code.</span>
            <span className="text-gray-400">Compete.</span>
            <br />
            <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">Conquer</span>
          </h1>

          <div className="space-y-3 md:space-y-4 text-gray-700 font-['Syne']">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
              Elevate your programming skills with Coding Hustlers. Dive into challenging coding quests and join a vibrant community of coding enthusiasts.
            </p>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
              Are you ready for the hustle?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] hover:opacity-90 text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-['Syne'] transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              Create Account
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="bg-white/70 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 text-gray-800 px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-['Syne'] transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1"
            >
              Explore Courses
            </button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">50+</div>
              <div className="text-sm md:text-base text-gray-600 font-['Syne']">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">10k+</div>
              <div className="text-sm md:text-base text-gray-600 font-['Syne']">Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">95%</div>
              <div className="text-sm md:text-base text-gray-600 font-['Syne']">Success</div>
            </div>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute top-20 right-0 w-32 h-32 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full opacity-60 blur-3xl animate-pulse"></div>
          <div className="absolute top-72 left-20 w-32 h-32 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full opacity-60 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <img
            src="/hero-person.png"
            alt="Coding enthusiast"
            className="relative z-10 w-full max-w-lg mx-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
