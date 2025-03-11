
export interface Project {
    project_name: string;
    duration: string;
    description: string;
    technologies:string[];
  }
  
  export interface EmploymentDetail {
    company: string;
    location: string;
    position: string;
    duration: string;
    projects: Project[];
  }
  
  export interface Resume {
    full_name: string | null;
    email_id: string | null;
    github_portfolio: string | null;
    linkedin_id: string | null;
    employment_details: EmploymentDetail[];
    technical_skills: string[];
    soft_skills: string[];
  }
  
  export interface FormValue {
    extracted_resume: Resume;
    job_description: string;
  }
  