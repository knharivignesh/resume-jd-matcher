import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetInputComponent } from './get-input.component';

describe('GetInputComponent', () => {
  let component: GetInputComponent;
  let fixture: ComponentFixture<GetInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
