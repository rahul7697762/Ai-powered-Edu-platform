export interface ProfessionalResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    github?: string;
    linkedin?: string;
    location?: string;
  };
  skills: {
    languages?: string[];
    machineLearning?: string[];
    tools?: string[];
    databases?: string[];
    versionControl?: string[];
    coreConcepts?: string[];
    softSkills?: string[];
  };
  experience: Array<{
    company: string;
    position: string;
    location: string;
    duration: string;
    description: string[];
  }>;
  projects: Array<{
    name: string;
    duration: string;
    technologies: string[];
    description: string[];
  }>;
  certificates: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  achievements: string[];
}