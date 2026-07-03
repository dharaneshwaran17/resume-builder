export type TemplateId = "classic" | "modern" | "minimal" | "corporate";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  photo?: string;
  summary: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  department: string;
  cgpa: string;
  year: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tech: string;
  github: string;
  live: string;
}

export interface CertificateItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Resume {
  id: string;
  name: string;
  template: TemplateId;
  accent: string;
  createdAt: string;
  updatedAt: string;
  personal: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: {
    languages: string[];
    frontend: string[];
    backend: string[];
    databases: string[];
    tools: string[];
    soft: string[];
  };
  certificates: CertificateItem[];
  achievements: string[];
  languages: string[];
  hobbies: string[];
  downloads: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}
