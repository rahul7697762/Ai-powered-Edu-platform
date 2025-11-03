// Page 2 — ResumeForm.tsx
import React, { useState } from "react";
import { Client } from "@gradio/client";
import { ResumeTemplate } from "../contexts";

interface Props {
  resumeTone: string;
  setResumeTone: (tone: "Professional" | "Technical" | "Creative") => void;
  template: ResumeTemplate;
  setTemplate: (template: ResumeTemplate) => void;
  fullName: string;
  setFullName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  address: string;
  setAddress: (address: string) => void;
  summary: string;
  setSummary: (summary: string) => void;
  experience: string;
  setExperience: (experience: string) => void;
  education: string;
  setEducation: (education: string) => void;
  skills: string;
  setSkills: (skills: string) => void;
}

const ResumeForm: React.FC<Props> = ({
  resumeTone,
  setResumeTone,
  template,
  setTemplate,
  fullName,
  setFullName,
  email,
  setEmail,
  phone,
  setPhone,
  address,
  setAddress,
  summary,
  setSummary,
  experience,
  setExperience,
  education,
  setEducation,
  skills,
  setSkills,
}) => {
  const [loadingSection, setLoadingSection] = useState<string | null>(null);

  // Function for AI-based rephrasing
  const handleRephraseText = async (text: string, setter: (v: string) => void, section: string) => {
    setLoadingSection(section);
    try {
      const client = await Client.connect("girishwangikar/ResumeATS");
      const result = await client.predict("/rephrase_text", {
        text,
        temperature: 0.7,
        max_tokens: 512,
      });
      setter(result.data as string);
    } catch (error) {
      console.error("Error rephrasing text:", error);
    } finally {
      setLoadingSection(null);
    }
  };

  // Reusable AI rephrase button
  const AiButton = ({ section, onClick }: { section: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      disabled={loadingSection === section}
      className="mt-2 mb-4 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 disabled:opacity-50"
    >
      {loadingSection === section ? "Processing..." : "✨ Rephrase with AI"}
    </button>
  );

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Information</h2>

      {/* Tone Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Professional", "Technical", "Creative"].map((tone) => (
          <button
            key={tone}
            type="button"
            onClick={() => setResumeTone(tone as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              resumeTone === tone
                ? "bg-indigo-600 text-white shadow"
                : "bg-gray-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-200"
            }`}
          >
            {tone}
          </button>
        ))}
      </div>

      {/* Personal Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
          />
        </div>
      </div>

      {/* Summary Section */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Summary
        <span className="text-xs text-gray-500 ml-2">(Use • for bullet points)</span>
      </label>
      <textarea
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        placeholder="• Experienced software engineer with 5+ years in web development&#10;• Proven track record of leading successful projects&#10;• Strong expertise in React, Node.js, and cloud technologies"
        className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
        rows={4}
      />
      <AiButton section="summary" onClick={() => handleRephraseText(summary, setSummary, "summary")} />

      {/* Experience Section */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Experience
        <span className="text-xs text-gray-500 ml-2">(Use • for bullet points)</span>
      </label>
      <textarea
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
        placeholder="• Senior Software Engineer - Tech Company (2020-2023)&#10;• Developed and maintained web applications using React and Node.js&#10;• Led a team of 5 developers on major client projects&#10;• Improved application performance by 40% through optimization&#10;&#10;• Junior Developer - StartupCo (2018-2020)&#10;• Built responsive web interfaces using modern JavaScript frameworks&#10;• Collaborated with designers to implement pixel-perfect UI components"
        className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
        rows={6}
      />
      <AiButton section="experience" onClick={() => handleRephraseText(experience, setExperience, "experience")} />

      {/* Education Section */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Education
        <span className="text-xs text-gray-500 ml-2">(Use • for bullet points)</span>
      </label>
      <textarea
        value={education}
        onChange={(e) => setEducation(e.target.value)}
        placeholder="• Bachelor of Science in Computer Science - University Name (2018)&#10;• GPA: 3.8/4.0, Dean's List&#10;• Relevant Coursework: Data Structures, Algorithms, Software Engineering&#10;• Senior Project: Built a full-stack e-commerce application"
        className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
        rows={4}
      />
      <AiButton section="education" onClick={() => handleRephraseText(education, setEducation, "education")} />

      {/* Skills Section */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Skills
        <span className="text-xs text-gray-500 ml-2">(Use • for bullet points)</span>
      </label>
      <textarea
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="• Programming Languages: JavaScript, Python, Java, TypeScript&#10;• Frontend: React, Vue.js, HTML5, CSS3, Tailwind CSS&#10;• Backend: Node.js, Express, Django, REST APIs&#10;• Databases: MongoDB, PostgreSQL, MySQL&#10;• Tools & Technologies: Git, Docker, AWS, Jenkins"
        className="w-full p-2 mt-1 bg-slate-100 dark:bg-slate-700 rounded"
        rows={4}
      />
      <AiButton section="skills" onClick={() => handleRephraseText(skills, setSkills, "skills")} />

      <div className="mt-6 text-right">
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          type="button"
        >
          Save & Continue →
        </button>
      </div>
    </div>
  );
};

export default ResumeForm;
