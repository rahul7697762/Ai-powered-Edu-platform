import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentor from './components/Mentor';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <Mentor />
        <Stats />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;