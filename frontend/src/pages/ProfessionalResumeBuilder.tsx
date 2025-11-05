import React, { useState } from 'react';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import ProfessionalResumeForm from '../components/forms/ProfessionalResumeForm';
import DownloadDropdown from '../components/DownloadDropdown';
import { sampleProfessionalResumeData, emptyProfessionalResumeData } from '../data/sampleResumeData';
import { ProfessionalResumeData } from '../types/resume';

const ProfessionalResumeBuilder: React.FC = () => {
  const [resumeData, setResumeData] = useState<ProfessionalResumeData>(emptyProfessionalResumeData);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');

  const handleLoadSample = () => {
    setResumeData(sampleProfessionalResumeData);
  };

  const handleClearData = () => {
    setResumeData(emptyProfessionalResumeData);
  };

  const getFilename = () => {
    const name = resumeData.personalInfo.fullName || 'resume';
    return name.toLowerCase().replace(/\s+/g, '_');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional Resume Builder</h1>
              <p className="text-gray-600">Create a professional resume with our advanced template</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
              >
                Load Sample
              </button>
              <button
                onClick={handleClearData}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear All
              </button>
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'edit'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'preview'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Preview
                </button>
              </div>
              <DownloadDropdown
                resumeData={resumeData}
                elementId="resume-preview"
                filename={getFilename()}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="lg:col-span-1">
              <ProfessionalResumeForm
                data={resumeData}
                onChange={setResumeData}
              />
            </div>
            
            {/* Live Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ transform: 'scale(0.7)', transformOrigin: 'top left', width: '142.86%' }}>
                  <div id="resume-preview">
                    <ProfessionalTemplate data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Preview */
          <div className="max-w-4xl mx-auto">
            <div id="resume-preview" className="bg-white rounded-lg shadow-lg overflow-hidden print:shadow-none print:rounded-none">
              <ProfessionalTemplate data={resumeData} />
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:shadow-none {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            height: 100% !important;
          }
          @page {
            margin: 0.5in;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalResumeBuilder;