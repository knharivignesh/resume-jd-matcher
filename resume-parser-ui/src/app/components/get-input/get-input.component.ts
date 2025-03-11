import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ResumeForm } from '../../app.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ApiClientService } from '../../service/api-client.service';

@Component({
  selector: 'app-get-input',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatStepperModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule],
  templateUrl: './get-input.component.html',
  styleUrl: './get-input.component.scss'
})
export class GetInputComponent implements AfterViewInit {

  @ViewChild('stepper') stepper: MatStepper;
  selectedFile: File;
  cardTitle = 'Extract resume content';
  isLinear = true;
  myForm!: FormGroup<ResumeForm>;
  
  constructor(private fb: FormBuilder, private readonly apiService: ApiClientService) {
    this.createForm();
  }

  createForm() {
    this.myForm = this.fb.group({
      file: new FormControl('', Validators.required),
      jobDescription: new FormControl('', Validators.required),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      console.log('File Selected:', file.name);
      this.selectedFile = file;
    }
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  onSubmit() {
    this.apiService.extractResumeData(this.myForm.value.jobDescription, this.selectedFile).subscribe(val => {
      console.log(val);
    });
  }
}
