import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#F1F3F9] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-300">
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-3xl md:text-4xl font-bold font-['Syne']">
              <span className="bg-gradient-to-r from-[#B33DEB] to-[#DE8FFF] bg-clip-text text-transparent">Coding</span>
              <br />
              <span className="text-gray-400">Hustlers</span>
            </h3>
            <div className="space-y-2 text-gray-800 font-['Syne']">
              <p className="font-bold text-sm">Address:</p>
              <p className="text-sm">Silicon Valley, India</p>
            </div>
            <div className="space-y-2 text-gray-800 font-['Syne']">
              <p className="font-bold text-sm">Contact:</p>
              <p className="text-sm">+91 98765 43210</p>
              <p className="text-sm">harshsrathod959@gmail.com</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-[#B33DEB] hover:text-[#DE8FFF] transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[#B33DEB] hover:text-[#DE8FFF] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[#B33DEB] hover:text-[#DE8FFF] transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[#B33DEB] hover:text-[#DE8FFF] transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 font-['Syne'] text-lg">About Us</h4>
            <ul className="space-y-3 font-['Syne']">
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">Careers</a></li>
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">Contact Us</a></li>
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">Terms and conditions</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 font-['Syne'] text-lg">Courses</h4>
            <ul className="space-y-3 font-['Syne']">
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">Tests</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 font-['Syne'] text-lg">Company wise</h4>
            <ul className="space-y-3 font-['Syne']">
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">How to begin?</a></li>
              <li><a href="#" className="text-gray-800 hover:text-[#B33DEB] transition-colors text-base">Test wise</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          <p className="text-gray-700 text-sm font-['Syne'] text-center">
            2024 Coding Hustlers. All right reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-700 hover:text-[#B33DEB] text-sm transition-colors font-['Syne'] underline">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-700 hover:text-[#B33DEB] text-sm transition-colors font-['Syne'] underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
