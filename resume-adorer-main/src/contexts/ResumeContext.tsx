
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the resume data structure
export interface ResumeData {
  personal?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    website?: string;
  };
  summary?: string;
  experience?: Array<{
    id: string;
    title?: string;
    company?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    highlights?: string[];
  }>;
  education?: Array<{
    id: string;
    institution?: string;
    degree?: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills?: Array<{
    id: string;
    name?: string;
    level?: string;
  }>;
  certifications?: Array<{
    id: string;
    name?: string;
    issuer?: string;
    date?: string;
  }>;
  languages?: Array<{
    id: string;
    language?: string;
    proficiency?: string;
  }>;
  projects?: Array<{
    id: string;
    name?: string;
    description?: string;
    url?: string;
    highlights?: string[];
  }>;
}

// Define the job description type
export type JobDescription = string;

// Define the context shape
interface ResumeContextType {
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
  jobDescription: JobDescription;
  setJobDescription: (description: JobDescription) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  selectedTemplate: string;
  setSelectedTemplate: (templateId: string) => void;
}

// Create context with default values
const ResumeContext = createContext<ResumeContextType>({
  resumeFile: null,
  setResumeFile: () => {},
  resumeData: null,
  setResumeData: () => {},
  jobDescription: '',
  setJobDescription: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  selectedTemplate: 'classic',
  setSelectedTemplate: () => {},
});

// Hook for using the resume context
export const useResumeContext = () => useContext(ResumeContext);

// Provider component
export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<JobDescription>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('classic');

  return (
    <ResumeContext.Provider
      value={{
        resumeFile,
        setResumeFile,
        resumeData,
        setResumeData,
        jobDescription,
        setJobDescription,
        isLoading,
        setIsLoading,
        error,
        setError,
        selectedTemplate,
        setSelectedTemplate,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
