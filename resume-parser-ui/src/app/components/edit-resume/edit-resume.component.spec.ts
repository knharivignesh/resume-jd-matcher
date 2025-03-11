import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditResumeComponent } from './edit-resume.component';

describe('EditResumeComponent', () => {
  let component: EditResumeComponent;
  let fixture: ComponentFixture<EditResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
