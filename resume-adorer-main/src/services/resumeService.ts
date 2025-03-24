
import { ResumeData } from '@/contexts/ResumeContext';
import axios, { AxiosResponse } from 'axios';

export const BASE_ENDPOINT_URL = 'http://localhost:8000';

export const createJobID = async (file: File, description: string) : Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append('pdf_file', file);
  formData.append('job_description', description);
  return axios.post(`${BASE_ENDPOINT_URL}/resume-job`, formData,{ headers: { 'Content-Type': 'multipart/form-data'}});
}

export const pollUntilValue = async (jobID: string , interval = 2000) => {
    const response = await axios.get(`${BASE_ENDPOINT_URL}/resume-job/${jobID}`);
    const data = response.data;

    console.log('Polling response:', data);

    if (checkConditionFn(data)) {
      // Condition met, return data
      return data;
    } else {
      // Condition not met, wait and poll again
      await new Promise(resolve => setTimeout(resolve, interval));
      return pollUntilValue( jobID , interval); // Recursive call
    }
}

function checkConditionFn(data) {
return data.job_description && data.extracted_resume;
}

// Mock function to parse resume
export const parseResume = async (file: File): Promise<ResumeData> => {
  // This is a mock implementation. In a real application, you would:
  // 1. Upload the file to a server
  // 2. Process it with a resume parser API or ML model
  // 3. Return the structured data
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data based on file type
  const fileName = file.name.toLowerCase();
  
  // Generate a random unique ID for each array item
  const generateId = () => Math.random().toString(36).substring(2, 10);
  
  // Mock data - in a real application this would come from parsing the actual resume
  return {
    personal: {
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/alexjohnson",
      website: "alexjohnson.dev"
    },
    summary: "Senior software engineer with 7+ years of experience developing scalable web applications using modern JavaScript frameworks and cloud technologies. Passionate about creating intuitive user experiences and optimizing application performance.",
    experience: [
      {
        id: generateId(),
        title: "Senior Frontend Engineer",
        company: "TechCorp Inc.",
        location: "San Francisco, CA",
        startDate: "2020-01",
        endDate: "Present",
        description: "Leading frontend development for the company's main SaaS product.",
        highlights: [
          "Rebuilt the frontend architecture using React and TypeScript, improving performance by 40%",
          "Implemented CI/CD pipeline that reduced deployment time by 65%",
          "Mentored junior developers and led code reviews"
        ]
      },
      {
        id: generateId(),
        title: "Software Engineer",
        company: "WebSolutions LLC",
        location: "Portland, OR",
        startDate: "2017-03",
        endDate: "2019-12",
        description: "Developed web applications for enterprise clients.",
        highlights: [
          "Created responsive UI components used across multiple projects",
          "Optimized database queries, reducing load times by 30%",
          "Implemented authentication system using OAuth 2.0"
        ]
      }
    ],
    education: [
      {
        id: generateId(),
        institution: "University of California, Berkeley",
        degree: "Master's",
        field: "Computer Science",
        startDate: "2015-09",
        endDate: "2017-05",
        gpa: "3.85"
      },
      {
        id: generateId(),
        institution: "Stanford University",
        degree: "Bachelor's",
        field: "Software Engineering",
        startDate: "2011-09",
        endDate: "2015-05",
        gpa: "3.7"
      }
    ],
    skills: [
      { id: generateId(), name: "JavaScript", level: "Expert" },
      { id: generateId(), name: "TypeScript", level: "Expert" },
      { id: generateId(), name: "React", level: "Expert" },
      { id: generateId(), name: "Node.js", level: "Advanced" },
      { id: generateId(), name: "GraphQL", level: "Advanced" },
      { id: generateId(), name: "AWS", level: "Intermediate" },
      { id: generateId(), name: "Docker", level: "Intermediate" },
      { id: generateId(), name: "CI/CD", level: "Advanced" }
    ],
    certifications: [
      {
        id: generateId(),
        name: "AWS Certified Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2021-06"
      },
      {
        id: generateId(),
        name: "Google Cloud Professional Developer",
        issuer: "Google",
        date: "2020-01"
      }
    ],
    languages: [
      { id: generateId(), language: "English", proficiency: "Native" },
      { id: generateId(), language: "Spanish", proficiency: "Intermediate" }
    ],
    projects: [
      {
        id: generateId(),
        name: "E-commerce Platform",
        description: "Developed a full-stack e-commerce solution with React, Node.js, and MongoDB",
        url: "github.com/alexj/ecommerce",
        highlights: [
          "Implemented secure payment processing with Stripe",
          "Created admin dashboard for inventory management",
          "Designed responsive UI for mobile and desktop"
        ]
      }
    ]
  };
};

// Mock function to match resume with job description
export const matchResumeWithJob = async (
  resumeData: ResumeData, 
  jobDescription: string
): Promise<{ matchScore: number; highlights: string[] }> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real application, this would use NLP to analyze the match
  // between the resume and job description
  
  // For demonstration, return a mock result
  return {
    matchScore: 85,
    highlights: [
      "Your experience with React matches the job requirements",
      "Your TypeScript skills are highly relevant for this position",
      "Consider highlighting your AWS experience more prominently",
      "The job requires Python skills which are not present in your resume"
    ]
  };
};

export const generateResume = async (
  job_id: string,
  template_id: string,
  resume_data: ResumeData
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("resume_data", JSON.stringify(resume_data));
  return axios.post(`${BASE_ENDPOINT_URL}generate-resume/${job_id}/template/${template_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    responseType: 'blob'
  });
}
