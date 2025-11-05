import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Mentor from './components/Mentor';
import Stats from './components/Stats';
import CTA from './components/CTA';
import Footer from './components/Footer';
import ResumeBuilder from './pages/ResumeBuilder';
import ProfessionalResumeBuilder from './pages/ProfessionalResumeBuilder';
import ATSTools from './pages/ATSTools';
import AuthPage from './pages/AuthPage';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AuthDebug from './components/AuthDebug';
import { ResumeProvider } from './contexts';
import { AuthProvider, useAuth } from './contexts/AuthContext';

type Page = 'home' | 'resumeBuilder' | 'professionalResume' | 'atsTools' | 'auth' | 'dashboard';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAuthenticated, loading } = useAuth();

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated && currentPage !== 'auth' && currentPage !== 'home') {
    return <AuthPage />;
  }

  return (
    <ResumeProvider>
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
          {currentPage === 'dashboard' && (
            <ProtectedRoute>
              <Dashboard navigateTo={navigateTo} />
            </ProtectedRoute>
          )}
          {currentPage === 'resumeBuilder' && (
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          )}
          {currentPage === 'professionalResume' && (
            <ProtectedRoute>
              <ProfessionalResumeBuilder />
            </ProtectedRoute>
          )}
          {currentPage === 'atsTools' && (
            <ProtectedRoute>
              <ATSTools />
            </ProtectedRoute>
          )}
          {currentPage === 'auth' && <AuthPage />}
        </main>
        <Footer />
        <AuthDebug />
      </div>
    </ResumeProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;