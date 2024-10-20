import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { EducationService } from '../../shared/services/education.service';
import { Education } from '../../shared/models/education';
import { finalize } from 'rxjs';
import { months } from '../../shared/constants/constants';

@Component({
  selector: 'app-education-modal',
  templateUrl: './education-modal.component.html',
  styleUrl: './education-modal.component.scss'
})
export class EducationModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  isSaving: boolean = false;
  educationForm: FormGroup;
  years: number[] = [];
  monthsList = months;

  constructor(private fb: NonNullableFormBuilder, private educationService: EducationService) {
    this.educationForm = this.initEducationForm();
  }

  ngOnInit() {
    this.generateYears();
    this.onCurrentlyStudyingChange();
  }

  private initEducationForm(): FormGroup {
    return this.fb.group({
      institution: ['', Validators.required],
      diploma: [''],
      domain: [''],
      startMonth: [0, Validators.required],
      startYear: [0, Validators.required],
      finishMonth: [0],
      finishYear: [0],
      currentlyStudying: [false]
    });
  }

  public onSubmit(): void {
    if (this.educationForm.valid) {
      // this.isLoading = true;
      this.create();
    } else {
      this.educationForm.markAllAsTouched();
    }
  }

  private create(): void {
    const formValues = this.educationForm.value;

    let education = new Education(formValues);
    
    this.educationService.create(education).pipe(
      finalize(() => {
        // this.isLoading = false;
      })).subscribe({
        next: () => {
          window.location.reload();
        },
        error: (error) => {
          console.error('Register failed', error);
        }
      })
  }

  private onCurrentlyStudyingChange(): void {
    this.educationForm.get('currentlyStudying')?.valueChanges.subscribe(currentlyStudying => {
      if (currentlyStudying) {
        this.educationForm.get('finishMonth')?.disable();
        this.educationForm.get('finishMonth')?.setValue(0);
        this.educationForm.get('finishYear')?.disable();
        this.educationForm.get('finishYear')?.setValue(0);
      } else {
        this.educationForm.get('finishMonth')?.enable();
        this.educationForm.get('finishYear')?.enable();
      }
    });
  }

  private generateYears(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 50;
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
