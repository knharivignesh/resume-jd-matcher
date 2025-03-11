import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiClientService {

  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) { }
  
  extractResumeData(jobDescription: string,file: File) {
    const formData = new FormData();
    formData.append('job_description', jobDescription); // Append job description
    formData.append('pdf_file', file, file.name);
    return this.http.post(`${this.apiUrl}/resume-job`, formData);
  }
}
