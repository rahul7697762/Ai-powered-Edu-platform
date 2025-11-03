import React from 'react';
import { ResumeTemplate } from '../contexts';

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplate;
  onTemplateChange: (template: ResumeTemplate) => void;
}

const templates = [
  {
    id: 'classic' as ResumeTemplate,
    name: 'Classic',
    description: 'Traditional professional layout',
    preview: '📄',
    color: 'bg-blue-100 border-blue-300 text-blue-800'
  },
  {
    id: 'modern' as ResumeTemplate,
    name: 'Modern',
    description: 'Clean contemporary design',
    preview: '🎨',
    color: 'bg-purple-100 border-purple-300 text-purple-800'
  },
  {
    id: 'minimal' as ResumeTemplate,
    name: 'Minimal',
    description: 'Simple and elegant',
    preview: '⚪',
    color: 'bg-gray-100 border-gray-300 text-gray-800'
  },
  {
    id: 'creative' as ResumeTemplate,
    name: 'Creative',
    description: 'Bold and colorful design',
    preview: '🌈',
    color: 'bg-green-100 border-green-300 text-green-800'
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Choose Template
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onTemplateChange(template.id)}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
              selectedTemplate === template.id
                ? `${template.color} border-opacity-100 shadow-md`
                : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:border-gray-300'
            }`}
          >
            <div className="text-center">
              <div className="text-2xl mb-2">{template.preview}</div>
              <div className="font-medium text-sm text-gray-900 dark:text-white">
                {template.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                {template.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;