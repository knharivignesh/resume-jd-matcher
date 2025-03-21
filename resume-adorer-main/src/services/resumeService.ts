
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
return !data.is_loading;
}

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
