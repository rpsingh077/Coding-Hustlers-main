import { Users, BookOpen, Target, Award, Github, Linkedin, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {

  const teamMembers = [
    {
      name: 'Harsh Rathod',
      role: 'Full Stack Developer',
      image: 'https://raw.githubusercontent.com/panduthegang/Verifai-News_Detection-System/refs/heads/main/public/Harsh.jpg',
      bio: 'Passionate about building scalable applications and creating seamless user experiences with modern technologies.',
      skills: ['React', 'Node.js', 'TypeScript']
    },
    {
      name: 'Durvesh Shelar',
      role: 'Backend Developer',
      image: 'https://raw.githubusercontent.com/panduthegang/Verifai-News_Detection-System/refs/heads/main/public/Durvesh.jpg',
      bio: 'Expert in database design and API development with a focus on performance optimization and scalability.',
      skills: ['Python', 'PostgreSQL', 'AWS']
    },
    {
      name: 'Rudrapratap Singh',
      role: 'Frontend Developer',
      image: 'https://github.com/panduthegang/Verifai-News_Detection-System/blob/main/public/Rudra.jpg?raw=true',
      bio: 'Specialist in creating beautiful, responsive interfaces with modern web technologies and design systems.',
      skills: ['React', 'UI/UX', 'Tailwind']
    }
  ];

  const stats = [
    { icon: BookOpen, label: 'Courses', value: '50+', color: 'from-blue-500 to-cyan-500' },
    { icon: Users, label: 'Students', value: '10k+', color: 'from-purple-500 to-pink-500' },
    { icon: Target, label: 'Success Rate', value: '95%', color: 'from-orange-500 to-red-500' },
    { icon: Award, label: 'Certificates', value: '8k+', color: 'from-green-500 to-emerald-500' }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      <section className="relative overflow-hidden pt-24 lg:pt-32 pb-16 lg:pb-24" style={{
        background: `
          radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
          radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
          radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
          radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
          #F5F5F5
        `
      }}>
        <div className="absolute inset-0 bg-[rgba(245,245,245,0.65)] backdrop-blur-[25px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <div className="inline-block mb-4 px-6 py-2 bg-white/50 backdrop-blur-sm rounded-full border-2 border-white/40">
              <span className="text-sm lg:text-base font-semibold font-['Syne'] bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
                About Us
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold font-['Syne'] text-black mb-6 leading-tight">
              Building the Future of
              <br />
              <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">
                Tech Education
              </span>
            </h1>
            <p className="text-lg lg:text-2xl text-gray-700 font-['Syne'] max-w-4xl mx-auto leading-relaxed">
              Empowering learners worldwide with cutting-edge programming education through
              interactive courses, hands-on challenges, and a supportive community
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border-2 border-white/40 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold font-['Poppins'] text-gray-800 text-center mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-gray-600 font-['Syne'] text-center font-medium">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="relative overflow-hidden" style={{
        background: `
          radial-gradient(27.33% 40.65% at 78.12% 29.89%, #F5FF7F 0%, rgba(48, 83, 118, 0) 100%),
          radial-gradient(33.55% 50.83% at 55.38% 89.56%, #8CBCFE 0%, rgba(221, 130, 255, 0) 100%),
          radial-gradient(58.68% 99.14% at 0% 0%, #C2F9F9 0%, rgba(83, 214, 255, 0) 100%),
          radial-gradient(30.1% 50.86% at 100% 100%, #9949FF 0%, rgba(255, 81, 217, 0) 100%),
          #F5F5F5
        `
      }}>
        <div className="absolute inset-0 bg-[rgba(245,245,245,0.65)] backdrop-blur-[25px]"></div>

        <main className="relative z-10 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            <section className="mb-16">
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 lg:p-12 border-2 border-white/40 shadow-xl">
                <h2 className="text-3xl lg:text-4xl font-bold font-['Syne'] text-black mb-6 text-center">
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-700 font-['Syne'] text-base lg:text-lg leading-relaxed">
                  <p>
                    LearnHub was born from a simple yet powerful vision: to make quality programming education accessible to everyone, everywhere. We recognized that traditional learning methods weren't keeping pace with the rapidly evolving tech landscape, and aspiring developers needed a more dynamic, practical approach to master coding skills.
                  </p>
                  <p>
                    Our platform combines interactive courses, hands-on coding challenges, and comprehensive assessments to create a holistic learning experience. We believe that everyone has the potential to become a skilled developer, and our mission is to provide the tools, guidance, and community support needed to turn that potential into reality.
                  </p>
                  <p>
                    What sets LearnHub apart is our commitment to practical, real-world learning. Every course is designed by industry professionals, every exercise mirrors actual development scenarios, and every test prepares you for the challenges you'll face in your career. We're not just teaching code; we're building the next generation of technology leaders.
                  </p>
                  <p>
                    Today, LearnHub serves thousands of students worldwide, helping them transition into tech careers, upskill in their current roles, or simply explore their passion for programming. Our community continues to grow, united by a shared commitment to continuous learning and technological excellence.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-4xl lg:text-5xl font-bold font-['Syne'] text-black mb-4">
                  Meet Our Team
                </h2>
                <p className="text-lg lg:text-xl text-gray-700 font-['Syne'] max-w-3xl mx-auto">
                  The talented individuals behind LearnHub, dedicated to revolutionizing tech education
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border-2 border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  >
                    <div className="relative h-80 lg:h-96 overflow-hidden">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-0 transition-transform duration-300">
                        <h3 className="text-2xl lg:text-3xl font-bold font-['Syne'] mb-2">
                          {member.name}
                        </h3>
                        <p className="text-base lg:text-lg font-semibold font-['Syne'] text-cyan-300 mb-3">
                          {member.role}
                        </p>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/90 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                        <div className="text-white text-center">
                          <h3 className="text-2xl lg:text-3xl font-bold font-['Syne'] mb-2">
                            {member.name}
                          </h3>
                          <p className="text-base lg:text-lg font-semibold font-['Syne'] text-cyan-300 mb-4">
                            {member.role}
                          </p>
                          <p className="text-sm lg:text-base font-['Syne'] leading-relaxed mb-4 text-gray-200">
                            {member.bio}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center mb-4">
                            {member.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs lg:text-sm font-semibold font-['Syne'] border border-white/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex gap-4 justify-center">
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                              <Github className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                              <Linkedin className="w-5 h-5" />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors">
                              <Mail className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="text-center mb-12">
              <div className="relative bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 rounded-3xl p-10 lg:p-16 shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10">
                  <h2 className="text-4xl lg:text-5xl font-bold font-['Syne'] text-white mb-6">
                    Ready to Start Your Journey?
                  </h2>
                  <p className="text-lg lg:text-2xl text-white/95 font-['Syne'] mb-8 max-w-3xl mx-auto leading-relaxed">
                    Join thousands of students who are already transforming their careers with LearnHub. Start learning today!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => window.location.href = '/signup'}
                      className="px-10 py-4 bg-white text-purple-600 rounded-xl font-['Syne'] font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
                    >
                      Get Started Free
                    </button>
                    <button
                      onClick={() => window.location.href = '/courses'}
                      className="px-10 py-4 bg-white/20 backdrop-blur-sm text-white border-2 border-white/40 rounded-xl font-['Syne'] font-bold text-lg hover:bg-white/30 transition-all hover:scale-105 hover:-translate-y-1"
                    >
                      Explore Courses
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default About;
