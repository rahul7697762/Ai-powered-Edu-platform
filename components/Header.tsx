import React, { useState } from 'react';
import ThemeToggleButton from './ThemeToggleButton';

const NavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} className="text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 px-3 py-2 rounded-md text-sm font-medium">
    {children}
  </a>
);

const MobileNavLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
    <a href={href} className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-slate-900 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium">
      {children}
    </a>
  );

const Header: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-slate-900 dark:text-white">EduAI</a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1">
              <NavLink href="#">Home</NavLink>
              <NavLink href="#">Resume Builder</NavLink>
              <NavLink href="#">ATS Checker</NavLink>
              <NavLink href="#">Placement Prep</NavLink>
              <NavLink href="#">Code IDE</NavLink>
              <NavLink href="#">Games</NavLink>
              <NavLink href="#">Mock Interview</NavLink>
              <div className="ml-4">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
          <div className="-mr-2 flex items-center md:hidden">
            <ThemeToggleButton />
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="ml-2 bg-gray-100 dark:bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="#">Home</MobileNavLink>
            <MobileNavLink href="#">Resume Builder</MobileNavLink>
            <MobileNavLink href="#">ATS Checker</MobileNavLink>
            <MobileNavLink href="#">Placement Prep</MobileNavLink>
            <MobileNavLink href="#">Code IDE</MobileNavLink>
            <MobileNavLink href="#">Games</MobileNavLink>
            <MobileNavLink href="#">Mock Interview</MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;