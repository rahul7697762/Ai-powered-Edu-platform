import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentor from './components/Mentor';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ResumeBuilder from './pages/ResumeBuilder';

type Page = 'home' | 'resumeBuilder';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-gray-100 font-sans">
      <Header navigateTo={navigateTo} />
      <main>
        {currentPage === 'home' && (
          <>
            <Hero />
            <Features />
            <Mentor />
            <Stats />
            <CTA />
          </>
        )}
        {currentPage === 'resumeBuilder' && <ResumeBuilder />}
      </main>
      <Footer />
    </div>
  );
};

export default App;