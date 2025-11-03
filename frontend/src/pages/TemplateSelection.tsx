import React from 'react';
import { ResumeTemplate } from '../contexts';

interface TemplateSelectionProps {
  onTemplateSelect: (template: ResumeTemplate) => void;
}

const templates = [
  {
    id: 'classic' as ResumeTemplate,
    name: 'Classic Professional',
    description: 'Traditional layout perfect for corporate roles',
    preview: '📄',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100',
    borderColor: 'border-blue-200 hover:border-blue-300'
  },
  {
    id: 'modern' as ResumeTemplate,
    name: 'Modern Sleek',
    description: 'Contemporary design with clean lines',
    preview: '🎨',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 hover:bg-purple-100',
    borderColor: 'border-purple-200 hover:border-purple-300'
  },
  {
    id: 'minimal' as ResumeTemplate,
    name: 'Minimal Clean',
    description: 'Simple and elegant, less is more',
    preview: '⚪',
    color: 'from-gray-500 to-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100',
    borderColor: 'border-gray-200 hover:border-gray-300'
  },
  {
    id: 'creative' as ResumeTemplate,
    name: 'Creative Bold',
    description: 'Vibrant design for creative professionals',
    preview: '🌈',
    color: 'from-green-500 to-blue-500',
    bgColor: 'bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100',
    borderColor: 'border-green-200 hover:border-green-300'
  },
  {
    id: 'executive' as ResumeTemplate,
    name: 'Executive Elite',
    description: 'Premium design for senior positions',
    preview: '👔',
    color: 'from-indigo-600 to-purple-600',
    bgColor: 'bg-indigo-50 hover:bg-indigo-100',
    borderColor: 'border-indigo-200 hover:border-indigo-300'
  },
  {
    id: 'tech' as ResumeTemplate,
    name: 'Tech Innovator',
    description: 'Perfect for developers and tech roles',
    preview: '💻',
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'bg-cyan-50 hover:bg-cyan-100',
    borderColor: 'border-cyan-200 hover:border-cyan-300'
  },
  {
    id: 'academic' as ResumeTemplate,
    name: 'Academic Scholar',
    description: 'Ideal for research and academic positions',
    preview: '🎓',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 hover:bg-amber-100',
    borderColor: 'border-amber-200 hover:border-amber-300'
  },
  {
    id: 'designer' as ResumeTemplate,
    name: 'Designer Portfolio',
    description: 'Showcase your design skills',
    preview: '🎭',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'bg-pink-50 hover:bg-pink-100',
    borderColor: 'border-pink-200 hover:border-pink-300'
  },
  {
    id: 'startup' as ResumeTemplate,
    name: 'Startup Dynamic',
    description: 'Energetic design for startup culture',
    preview: '🚀',
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-50 hover:bg-emerald-100',
    borderColor: 'border-emerald-200 hover:border-emerald-300'
  },
  {
    id: 'corporate' as ResumeTemplate,
    name: 'Corporate Standard',
    description: 'Professional standard for large corporations',
    preview: '🏢',
    color: 'from-slate-600 to-slate-700',
    bgColor: 'bg-slate-50 hover:bg-slate-100',
    borderColor: 'border-slate-200 hover:border-slate-300'
  }
];

const TemplateSelection: React.FC<TemplateSelectionProps> = ({ onTemplateSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Resume Template
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Select a professional template that matches your industry and personal style. 
            Each template is designed to help you stand out while maintaining readability.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => onTemplateSelect(template.id)}
              className={`${template.bgColor} ${template.borderColor} border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group`}
            >
              {/* Template Preview */}
              <div className="text-center mb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${template.color} flex items-center justify-center text-2xl text-white shadow-lg group-hover:shadow-xl transition-shadow`}>
                  {template.preview}
                </div>
              </div>

              {/* Template Info */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {template.description}
                </p>
                
                {/* Select Button */}
                <button className={`w-full py-2 px-4 rounded-lg bg-gradient-to-r ${template.color} text-white font-medium hover:shadow-md transition-all duration-200 transform group-hover:scale-105`}>
                  Select Template
                </button>
              </div>

              {/* Preview Badge */}
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 shadow-sm">
                  ✨ Professional
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Not sure which template to choose? Start with Classic Professional - it works great for most industries.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => onTemplateSelect('classic')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Start with Classic
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;