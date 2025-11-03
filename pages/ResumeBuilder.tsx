import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

type ResumeTone = 'Professional' | 'Technical' | 'Creative';

const ResumeBuilder: React.FC = () => {
  const [fullName, setFullName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Main St, Anytown, USA');
  const [summary, setSummary] = useState('A highly motivated and results-oriented professional with experience in software development.');
  const [experience, setExperience] = useState('Software Engineer at Tech Corp (2020-Present)\n- Developed and maintained web applications using React and Node.js.\n- Collaborated with cross-functional teams to deliver high-quality software.');
  const [education, setEducation] = useState('B.S. in Computer Science - University of Technology (2016-2020)');
  const [skills, setSkills] = useState('JavaScript, React, Node.js, Python, SQL');
  
  const [loadingSection, setLoadingSection] = useState<string | null>(null);
  const [resumeTone, setResumeTone] = useState<ResumeTone>('Professional');


  const handleGenerate = async (section: 'summary' | 'experience' | 'skills') => {
    setLoadingSection(section);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

        let prompt = '';
        switch (section) {
            case 'summary':
                prompt = `Based on the following experience: "${experience}" and skills: "${skills}", write a compelling professional summary for a resume with a ${resumeTone.toLowerCase()} tone.`;
                break;
            case 'experience':
                prompt = `Based on the following job title and responsibilities: "${experience}", expand on the bullet points with more detail and quantifiable achievements for a resume, using a ${resumeTone.toLowerCase()} tone. If there are no details, generate some for a generic software engineer role.`;
                break;
            case 'skills':
                 prompt = `Based on the following experience: "${experience}", generate a comma-separated list of relevant technical skills for a resume, suitable for a role that requires a ${resumeTone.toLowerCase()} presentation.`;
                 break;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        const text = response.text;

        switch (section) {
            case 'summary':
                setSummary(text);
                break;
            case 'experience':
                setExperience(text);
                break;
            case 'skills':
                setSkills(text);
                break;
        }

    } catch (error) {
        console.error("Error generating content:", error);
        // You might want to show an error message to the user
    } finally {
        setLoadingSection(null);
    }
  };

  const AiButton: React.FC<{ section: 'summary' | 'experience' | 'skills' }> = ({ section }) => (
    <button
      onClick={() => handleGenerate(section)}
      disabled={loadingSection === section}
      className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 disabled:opacity-50 disabled:cursor-wait"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${loadingSection === section ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      {loadingSection === section ? 'Generating...' : 'Generate with AI'}
    </button>
  );

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            AI-Powered <span className="text-indigo-600 dark:text-indigo-400">Resume Builder</span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300">
            Create a professional resume in minutes with the help of AI.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="bg-gray-50 dark:bg-slate-800 p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Information</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Tone</label>
                <div className="flex flex-wrap gap-2">
                    {(['Professional', 'Technical', 'Creative'] as ResumeTone[]).map((tone) => (
                        <button
                            key={tone}
                            type="button"
                            onClick={() => setResumeTone(tone)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                resumeTone === tone
                                ? 'bg-indigo-600 text-white shadow'
                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-600'
                            }`}
                        >
                            {tone}
                        </button>
                    ))}
                </div>
              </div>
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
                <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
                 <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                  <input type="tel" id="phone" value={phone} onChange={e => setPhone(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
                </div>
              </div>
               <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                <input type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
               <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Professional Summary</label>
                <textarea id="summary" value={summary} onChange={e => setSummary(e.target.value)} rows={4} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                <AiButton section="summary" />
              </div>
               <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Work Experience</label>
                <textarea id="experience" value={experience} onChange={e => setExperience(e.target.value)} rows={6} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                 <AiButton section="experience" />
              </div>
              <div>
                <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Education</label>
                <textarea id="education" value={education} onChange={e => setEducation(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
               <div>
                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skills</label>
                <textarea id="skills" value={skills} onChange={e => setSkills(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                 <AiButton section="skills" />
              </div>
            </div>
          </div>

          {/* Preview Section */}
          <div>
             <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Live Preview</h2>
             <div className="bg-white dark:bg-slate-800 shadow-lg rounded-lg p-8 border border-slate-200 dark:border-slate-700 aspect-[1/1.414]">
                 <header className="text-center border-b pb-4 border-slate-300 dark:border-slate-600">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{fullName}</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {email} | {phone} | {address}
                    </p>
                 </header>
                 <main className="mt-6 text-sm text-gray-700 dark:text-gray-300">
                    <section>
                        <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Summary</h2>
                        <p className="whitespace-pre-wrap">{summary}</p>
                    </section>
                     <section className="mt-6">
                        <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Experience</h2>
                        <div className="whitespace-pre-wrap">{experience}</div>
                    </section>
                     <section className="mt-6">
                        <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Education</h2>
                        <p className="whitespace-pre-wrap">{education}</p>
                    </section>
                     <section className="mt-6">
                        <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">Skills</h2>
                        <p className="whitespace-pre-wrap">{skills}</p>
                    </section>
                 </main>
             </div>
             <button className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105">
                Download as PDF
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;