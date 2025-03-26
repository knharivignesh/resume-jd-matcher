import axios, { AxiosResponse } from "axios";

import { ResumeData } from "@/contexts/ResumeContext";

export const BASE_ENDPOINT_URL = "https://data-dynamos.payoda.net/api";

export const createJobID = async (
  file: File,
  description: string
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("pdf_file", file);
  formData.append("job_description", description);
  return axios.post(`${BASE_ENDPOINT_URL}/resume-job`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const pollUntilValue = async (jobID: string, interval = 5000) => {
  const response = await axios.get(`${BASE_ENDPOINT_URL}/resume-job/${jobID}`);
  const data = response.data;

  console.log("Polling response:", data);

  if (checkConditionFn(data)) {
    // Condition met, return data
    return data;
  } else {
    // Condition not met, wait and poll again
    await new Promise((resolve) => setTimeout(resolve, interval));
    return pollUntilValue(jobID, interval); // Recursive call
  }
};

function checkConditionFn(data) {
  return !data.is_loading;
}

export const generateResume = async (
  job_id: string,
  template_id: string,
  resume_data: ResumeData
): Promise<AxiosResponse> => {
  const formData = new FormData();
  formData.append("resume_data", JSON.stringify(resume_data));
  return axios.post(
    `${BASE_ENDPOINT_URL}generate-resume/${job_id}/template/${template_id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    }
  );
};
