// Page 3 — ResumePreview.tsx
import React from "react";

import { ResumeTemplate } from "../contexts";

interface Props {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  summary?: string;
  experience?: string;
  education?: string;
  skills?: string;
  template: ResumeTemplate;
  onDownload: () => void;
  isGeneratingPDF?: boolean;
}

const ResumePreview: React.FC<Props> = ({
  fullName = '',
  email = '',
  phone = '',
  address = '',
  summary = '',
  experience = '',
  education = '',
  skills = '',
  template,
  onDownload,
  isGeneratingPDF = false,
}) => {
  // Helper function to format text with bullet points
  const formatTextWithBullets = (text: string | undefined | null) => {
    if (!text || typeof text !== 'string') return null;
    
    const lines = text.split('\n').filter(line => line.trim());
    
    return (
      <div className="space-y-1">
        {lines.map((line, index) => {
          const trimmedLine = line.trim();
          // Check if line starts with bullet point indicators
          if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
            return (
              <div key={index} className="flex items-start">
                <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                <span>{trimmedLine.substring(1).trim()}</span>
              </div>
            );
          }
          // Regular line without bullet
          return <div key={index}>{trimmedLine}</div>;
        })}
      </div>
    );
  };
  const getTemplateStyles = () => {
    switch (template) {
      case 'modern':
        return {
          container: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-indigo-600 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-indigo-600 dark:text-indigo-400 font-bold text-lg border-b-2 border-indigo-200 pb-1',
          content: 'p-6'
        };
      case 'minimal':
        return {
          container: 'bg-white dark:bg-slate-800 border-l-4 border-gray-400',
          header: 'border-b border-gray-200 dark:border-slate-600 pb-4',
          sectionHeader: 'text-gray-800 dark:text-gray-200 font-semibold text-sm uppercase tracking-wide',
          content: 'p-6'
        };
      case 'creative':
        return {
          container: 'bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 font-bold text-lg',
          content: 'p-6'
        };
      case 'executive':
        return {
          container: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-indigo-700 dark:text-indigo-400 font-bold text-lg border-b border-indigo-300 pb-2',
          content: 'p-6'
        };
      case 'tech':
        return {
          container: 'bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-cyan-600 dark:text-cyan-400 font-mono font-bold text-lg',
          content: 'p-6'
        };
      case 'academic':
        return {
          container: 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-amber-700 dark:text-amber-400 font-serif font-bold text-lg',
          content: 'p-6'
        };
      case 'designer':
        return {
          container: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-gradient-to-r from-pink-500 to-rose-500 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-pink-600 dark:text-pink-400 font-bold text-lg italic',
          content: 'p-6'
        };
      case 'startup':
        return {
          container: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-700',
          header: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 rounded-t-lg',
          sectionHeader: 'text-emerald-600 dark:text-emerald-400 font-bold text-lg',
          content: 'p-6'
        };
      case 'corporate':
        return {
          container: 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600',
          header: 'bg-slate-600 text-white p-6',
          sectionHeader: 'text-slate-700 dark:text-slate-300 font-bold text-lg uppercase tracking-wider',
          content: 'p-8'
        };
      default: // classic
        return {
          container: 'bg-white dark:bg-slate-800',
          header: 'border-b pb-4 border-slate-300 dark:border-slate-600',
          sectionHeader: 'text-indigo-700 dark:text-indigo-400 font-bold text-lg uppercase',
          content: 'p-8'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
        Live Resume Preview - {template.charAt(0).toUpperCase() + template.slice(1)} Template
      </h2>

      {/* Resume Card */}
      <div className={`shadow-lg rounded-lg border border-slate-200 dark:border-slate-700 ${styles.container}`}>
        <div className={styles.content}>
          {/* Header Section */}
          <header className={`text-center ${styles.header}`}>
            <h1 className="text-3xl font-bold tracking-tight">
              {fullName || "Your Name"}
            </h1>
            <p className="text-sm mt-1 opacity-90">
              {email || "you@example.com"} | {phone || "000-000-0000"} |{" "}
              {address || "City, Country"}
            </p>
          </header>

          {/* Content Section */}
          <main className="mt-6 text-sm text-gray-700 dark:text-gray-300 space-y-6">
            {/* Summary */}
            <section>
              <h2 className={`${styles.sectionHeader} mb-2`}>
                Summary
              </h2>
              <div className="text-sm">
                {formatTextWithBullets(summary) || (
                  <div className="text-gray-500 italic">
                    Write a short summary highlighting your experience, strengths, and professional goals.
                  </div>
                )}
              </div>
            </section>

            {/* Experience */}
            <section>
              <h2 className={`${styles.sectionHeader} mb-2`}>
                Experience
              </h2>
              <div className="text-sm">
                {formatTextWithBullets(experience) || (
                  <div className="text-gray-500 italic space-y-1">
                    <div>Add your work experience here. Use bullet points like:</div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Software Engineer at Tech Company (2020-2023)</span>
                    </div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Developed web applications using React and Node.js</span>
                    </div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Led a team of 5 developers on major projects</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Education */}
            <section>
              <h2 className={`${styles.sectionHeader} mb-2`}>
                Education
              </h2>
              <div className="text-sm">
                {formatTextWithBullets(education) || (
                  <div className="text-gray-500 italic space-y-1">
                    <div>List your education history. Example:</div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Bachelor of Science in Computer Science - University Name (2020)</span>
                    </div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>GPA: 3.8/4.0, Dean's List</span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className={`${styles.sectionHeader} mb-2`}>
                Skills
              </h2>
              <div className="text-sm">
                {formatTextWithBullets(skills) || (
                  <div className="text-gray-500 italic space-y-1">
                    <div>Add your skills using bullet points:</div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Programming: JavaScript, Python, Java</span>
                    </div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Frameworks: React, Node.js, Express</span>
                    </div>
                    <div className="flex items-start ml-4">
                      <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                      <span>Tools: Git, Docker, AWS</span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={onDownload}
        disabled={isGeneratingPDF}
        className={`mt-6 w-full py-3 rounded-lg transition ${
          isGeneratingPDF
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        } text-white`}
      >
        {isGeneratingPDF ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating PDF...
          </span>
        ) : (
          '📄 Download as PDF'
        )}
      </button>
    </div>
  );
};

export default ResumePreview;
