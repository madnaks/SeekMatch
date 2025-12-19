import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EducationService } from '../../../../shared/services/education.service';
import { Education } from '../../../../shared/models/education';
import { finalize } from 'rxjs';
import { months } from '../../../../shared/constants/constants';
import { ToastService } from '../../../../shared/services/toast.service';
import { ModalActionType } from '../../../../shared/enums/enums';

@Component({
  selector: 'app-education-modal',
  templateUrl: './education-modal.component.html',
  styleUrl: './education-modal.component.scss'
})
export class EducationModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedEducation: Education | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  isSaving: boolean = false;
  updateMode: boolean = false;
  educationForm: FormGroup;
  years: number[] = [];
  monthsList = months;

  constructor(
    private fb: NonNullableFormBuilder, 
    private educationService: EducationService,
    private toastService: ToastService) {
    this.educationForm = this.initEducationForm();
  }

  ngOnInit() {
    this.generateYears();
    this.onCurrentlyStudyingChange();
    if (this.selectedEducation != undefined) {
      this.updateMode = true;
      this.populateForm(this.selectedEducation);
    }
  }

  private initEducationForm(): FormGroup {
    return this.fb.group({
      institution: ['', Validators.required],
      diploma: [''],
      domain: [''],
      startMonth: [0, this.nonZeroValidator],
      startYear: [0, this.nonZeroValidator],
      endMonth: [0],
      endYear: [0],
      currentlyStudying: [false]
    }, {
      validators: [this.dateRangeValidator, this.endDateTwoFieldsValidator]
    });
  }

  private populateForm(education: Education): void {
    this.educationForm.patchValue({
      institution: education.institution,
      diploma: education.diploma,
      domain: education.domain,
      startMonth: education.startMonth,
      startYear: education.startYear,
      endMonth: education.endMonth,
      endYear: education.endYear,
      currentlyStudying: education.currentlyStudying
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.educationForm.valid) {
      this.isSaving = true;
      if (this.updateMode) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.educationForm.markAllAsTouched();
    }
  }

  private onCurrentlyStudyingChange(): void {
    this.educationForm.get('currentlyStudying')?.valueChanges.subscribe(currentlyStudying => {
      if (currentlyStudying) {
        this.educationForm.get('endMonth')?.disable();
        this.educationForm.get('endMonth')?.setValue(0);
        this.educationForm.get('endYear')?.disable();
        this.educationForm.get('endYear')?.setValue(0);
      } else {
        this.educationForm.get('endMonth')?.enable();
        this.educationForm.get('endYear')?.enable();
      }
    });
  }
  //#endregion


  private create(): void {
    const formValues = this.educationForm.value;

    let education = new Education(formValues);

    this.educationService.create(education).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Creation of education failed', error);
        }
      });
  }

  private update(): void {
    const formValues = this.educationForm.value;

    let education = new Education(formValues);
    education.id = this.selectedEducation?.id;

    this.educationService.update(education).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Update);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Update of education failed', error);
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

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  //#region : Form validation
  private dateRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const formGroup = control as FormGroup;

    const currentlyStudying = formGroup.get('currentlyStudying')?.value;

    if (currentlyStudying) return null;

    const startYear = Number(formGroup.get('startYear')?.value);
    const startMonth = Number(formGroup.get('startMonth')?.value);
    const endYear = Number(formGroup.get('endYear')?.value);
    const endMonth = Number(formGroup.get('endMonth')?.value);

    if (endYear == 0 || endMonth == 0) return null;

    const startDate = startYear + startMonth / 12;
    const endDate = endYear + endMonth / 12;

    if (startDate > endDate) {
      return { invalidDateRange: true };
    }

    return null;
  }

  private nonZeroValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return Number(control.value) === 0 ? { requiredSelection: true } : null;
  }

  /**
   * endMonth & endYear are not required, but if one is filled the other most be required
   * @param control 
   * @returns 
   */
  private endDateTwoFieldsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    const formGroup = control as FormGroup;

    const endYear = formGroup.get('endYear')?.value;
    const endMonth = formGroup.get('endMonth')?.value;

    return (endYear != 0 && endMonth == 0) || (endYear == 0 && endMonth != 0)
      ? { invalidEndDateTwoFields: true }
      : null;
  }
  //#endregion

}