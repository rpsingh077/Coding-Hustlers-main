import React from 'react';

const CommunitySection = () => {
  return (
    <section className="py-20 md:py-32" style={{
      background: `
        radial-gradient(circle at 80% 50%, rgba(140, 188, 254, 0.25) 0%, transparent 100%),
        radial-gradient(circle at 20% 50%, rgba(142, 73, 255, 0.2) 0%, transparent 100%),
        linear-gradient(to right, #E8E8E8, #F5F5F5)
      `
    }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        <div className="space-y-6 md:space-y-8">
          <div className="inline-block mb-2 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full border-2 border-white/40">
            <span className="text-sm lg:text-base font-semibold font-['Syne'] bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
              Join the Community
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Syne'] leading-tight">
            Questions, Community & Contests
          </h2>

          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-['Syne']">
            Over 2800 questions for you to practice. Come and join one of the largest tech communities with hundreds of thousands of active users and participate in our contests to challenge yourself and earn rewards.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">2800+</div>
              <div className="text-sm text-gray-600 font-['Syne']">Practice Questions</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">50+</div>
              <div className="text-sm text-gray-600 font-['Syne']">Weekly Contests</div>
            </div>
          </div>

          <button className="bg-white/70 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400 text-gray-800 px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-['Syne'] transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1">
            View Questions
          </button>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute top-12 left-12 w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/60 shadow-2xl">
            <img
              src="/community-illustration.png"
              alt="Community member"
              className="w-full max-w-lg mx-auto drop-shadow-xl relative z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
