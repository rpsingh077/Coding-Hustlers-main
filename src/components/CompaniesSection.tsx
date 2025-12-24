import React from 'react';

const CompaniesSection = () => {
  return (
    <section className="py-20 md:py-32" style={{
      background: `
        radial-gradient(circle at 20% 50%, rgba(140, 188, 254, 0.2) 0%, transparent 100%),
        radial-gradient(circle at 80% 50%, rgba(142, 73, 255, 0.15) 0%, transparent 100%),
        linear-gradient(to right, #F5F5F5, #E8E8E8)
      `
    }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        <div className="relative order-2 md:order-1 hidden md:block">
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-12 right-12 w-24 h-24 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl p-8 border-2 border-white/60 shadow-2xl">
            <img
              src="/coding-illustration.png"
              alt="Developer working"
              className="w-full max-w-lg mx-auto drop-shadow-xl relative z-10"
            />
          </div>
        </div>

        <div className="space-y-6 md:space-y-8 order-1 md:order-2">
          <div className="inline-block mb-2 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full border-2 border-white/40">
            <span className="text-sm lg:text-base font-semibold font-['Syne'] bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
              For Businesses
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Syne'] leading-tight">
            Companies & Candidates
          </h2>

          <p className="text-gray-700 text-base sm:text-lg md:text-xl leading-relaxed font-['Syne']">
            Not only does CodingHustlers prepare candidates for technical interviews, we also help companies identify top technical talent. From sponsoring contests to providing online assessments and training, we offer numerous services to businesses.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">500+</div>
              <div className="text-sm text-gray-600 font-['Syne']">Partner Companies</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border-2 border-white/40 shadow-lg">
              <div className="text-2xl font-bold bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent font-['Poppins']">1M+</div>
              <div className="text-sm text-gray-600 font-['Syne']">Assessments</div>
            </div>
          </div>

          <button className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] hover:opacity-90 text-white px-8 md:px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-['Syne'] transition-all shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-1">
            Career Opportunities
          </button>
        </div>
      </div>
    </section>
  );
};

export default CompaniesSection;
