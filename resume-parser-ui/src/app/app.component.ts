import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatStepper } from '@angular/material/stepper';
import { MatStepperModule } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';

export interface ResumeForm {
  file: FormControl;
  jobDescription: FormControl;
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatFormFieldModule,
    MatStepperModule,
    MatToolbarModule,
    MatIconModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('stepper') stepper: MatStepper;
  cardTitle = 'Extract resume content';
  isLinear = true;
  myForm!: FormGroup<ResumeForm>;

  constructor(private fb: FormBuilder) {
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
    }
  }

  ngAfterViewInit() {
    this.stepper._getIndicatorType = () => 'number';
  }

  onSubmit() {
    console.log(this.myForm.value);
  }
}
