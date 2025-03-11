import { Component } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Project } from './FormType';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-edit-resume',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './edit-resume.component.html',
  styleUrl: './edit-resume.component.scss',
})
export class EditResumeComponent {
  resumeForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.resumeForm = this.fb.group({
      full_name: new FormControl(''),
      email_id: new FormControl(''),
      github_portfolio: new FormControl(null),
      linkedin_id: new FormControl(null),
      employment_details: this.fb.array([]),
      technical_skills: this.fb.array([]),
      soft_skills: this.fb.array([]),
    });

    this.setEmploymentDetails();
    this.setTechnicalSkills();
    this.setSoftSkills();
  }

  // Method to get the employment details FormArray
  get employmentDetails(): FormArray {
    return this.resumeForm.get('employment_details') as FormArray;
  }

  // Method to get the technical skills FormArray
  get technicalSkills(): FormArray {
    return this.resumeForm.get('technical_skills') as FormArray;
  }

  // Method to get the soft skills FormArray
  get softSkills(): FormArray {
    return this.resumeForm.get('soft_skills') as FormArray;
  }

  // Method to get the soft skills FormArray
  get projects(): FormArray {
    return this.resumeForm
      .get('employment_details')
      ?.get('projects') as FormArray;
  }

  // Add Employment Details to the FormArray
  setEmploymentDetails() {
    const employmentDetail = {
      company: 'iGold Technologies Pvt Ltd',
      location: 'Chennai',
      position: 'Programmer',
      duration: '2 years',
      projects: [
        {
          project_name: '3D XR Tool',
          duration: 'Feb 2020 to Till Date',
          description:
            'Create unique 3D based ecommerce, virtual tour web application for constructions etc.',
          technologies: ['Angular (v12, v13)', 'BabylonJS v5', 'nodejs'],
        },
        {
          project_name: 'Website Development',
          duration: 'Jan 2020 to Feb 2019',
          description: 'Maintain website using HTML, CSS, and JavaScript.',
          technologies: ['HTML', 'CSS', 'JavaScript'],
        },
        {
          project_name: 'Syncfusion Pivot Table',
          duration: 'Oct 2019 to Nov 2020',
          description: 'Part of Syncfusion pivot table team.',
          technologies: ['ASP Dot Net', 'C#'],
        },
      ],
    };

    const employmentFormGroup = this.fb.group({
      company: new FormControl(employmentDetail.company),
      location: new FormControl(employmentDetail.location),
      position: new FormControl(employmentDetail.position),
      duration: new FormControl(employmentDetail.duration),
      projects: this.fb.array(
        employmentDetail.projects.map((project) => this.createProject(project))
      ),
    });

    this.employmentDetails.push(employmentFormGroup);
  }

  // Add Technical Skills to the FormArray
  setTechnicalSkills() {
    const technicalSkills = [
      'Angular (v-12,13)',
      'Asp dot net (C#)',
      'HTML',
      'CSS',
      'SCSS',
      'C#',
      'JavaScript',
      'Typescript',
      'SVN',
      'Git hub',
      'MySQL',
      'Visual Studio Code',
    ];

    technicalSkills.forEach((skill) => {
      this.technicalSkills.push(new FormControl(skill));
    });
  }

  // Add Soft Skills to the FormArray
  setSoftSkills() {
    const softSkills = [
      'Good communication',
      'Analytical skills',
      'Interpersonal skills',
      'Ability to perform as part of a team',
      'Ability to grasp and apply new concepts quickly',
    ];

    softSkills.forEach((skill) => {
      this.softSkills.push(new FormControl(skill));
    });
  }

  // Create a FormGroup for a Project
  createProject(project: Project): FormGroup {
    return this.fb.group({
      project_name: new FormControl(project.project_name),
      duration: new FormControl(project.duration),
      description: new FormControl(project.description),
      technologies: this.fb.array(
        project.technologies.map((tech) => new FormControl(tech))
      ),
    });
  }

  // Method to submit the form (for testing)
  onSubmit() {
    console.log(this.resumeForm.value);
  }
  // Method to add a new technology (by pressing enter)
  addTechnology(projectIndex: number): void {
    // const technologies = this.getTechnologies(projectIndex);
    // technologies.push(this.fb.control(''));
  }

  // Method to remove a technology
  removeTechnology(projectIndex: number, techIndex: number): void {
    // const technologies = this.getTechnologies(projectIndex);
    // technologies.removeAt(techIndex);
  }
  removeSkill(projectIndex: number, techIndex: number) {

  }

  addSoftSkills(ele: HTMLInputElement){
    this.softSkills.controls.push(new FormControl(ele.value));
    ele.value = "";
  }
}
