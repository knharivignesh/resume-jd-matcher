import React, { ReactNode, createContext, useContext, useState } from "react";

// Define the resume data structure
export interface ResumeData {
  fullName: string;
  emailId: string;
  githubPortfolio?: string;
  linkedinId: string;
  professionalSummary?: string;
  experience?: [
    {
      companyName?: string;
      role?: string;
      duration?: string;
      responsibilities?: string[];
    }
  ];
  technicalSkills?: string[];
  softSkills?: string[];
  achievements?: string[];
  gaps?: [];
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
  jobDescription: "",
  setJobDescription: () => {},
  isLoading: false,
  setIsLoading: () => {},
  error: null,
  setError: () => {},
  selectedTemplate: "classic",
  setSelectedTemplate: () => {},
});

// Hook for using the resume context
export const useResumeContext = () => useContext(ResumeContext);

// Provider component
export const ResumeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [jobDescription, setJobDescription] = useState<JobDescription>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template_2");

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
