import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import CompaniesSection from '../components/CompaniesSection';
import CommunitySection from '../components/CommunitySection';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <CompaniesSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Landing;
