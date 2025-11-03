import React, { useState } from "react";
import ResumeForm from "./ResumeForm";
import ResumePreview from "./ResumePreview";
import TemplateSelection from "./TemplateSelection";
import { useResume, ResumeData, ResumeTemplate } from "../contexts";

const ResumeBuilder: React.FC = () => {
  const { resumeData, setResumeData } = useResume();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(true);

  const handleFieldChange = (field: keyof ResumeData, value: any) => {
    setResumeData((prev: ResumeData) => ({ ...prev, [field]: value }));
  };

  const handleTemplateSelect = (template: ResumeTemplate) => {
    setResumeData((prev: ResumeData) => ({ ...prev, template }));
    setShowTemplateSelection(false);
  };

  const handleBackToTemplates = () => {
    setShowTemplateSelection(true);
  };

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    try {
      const response = await fetch("http://localhost:5000/api/resume-builder/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resumeData.fullName || 'resume'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to generate PDF. Please make sure the backend server is running and try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Show template selection first
  if (showTemplateSelection) {
    return <TemplateSelection onTemplateSelect={handleTemplateSelect} />;
  }

  // Show the builder after template selection
  return (
    <div className="py-10 bg-gray-50 dark:bg-slate-900 min-h-screen">
      {/* Header with back button */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToTemplates}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Change Template
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Resume Builder - {resumeData.template.charAt(0).toUpperCase() + resumeData.template.slice(1)} Template
            </h1>
          </div>
          <div></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
        <ResumeForm
          {...resumeData}
          setFullName={(v) => handleFieldChange("fullName", v)}
          setEmail={(v) => handleFieldChange("email", v)}
          setPhone={(v) => handleFieldChange("phone", v)}
          setAddress={(v) => handleFieldChange("address", v)}
          setSummary={(v) => handleFieldChange("summary", v)}
          setExperience={(v) => handleFieldChange("experience", v)}
          setEducation={(v) => handleFieldChange("education", v)}
          setSkills={(v) => handleFieldChange("skills", v)}
          setResumeTone={(v) => handleFieldChange("resumeTone", v)}
          setTemplate={(v) => handleFieldChange("template", v)}
        />
        <ResumePreview {...resumeData} onDownload={handleDownload} isGeneratingPDF={isGeneratingPDF} />
      </div>
    </div>
  );
};

export default ResumeBuilder;
