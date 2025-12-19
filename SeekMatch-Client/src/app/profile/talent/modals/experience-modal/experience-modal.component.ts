import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { jobTypes, months } from '@app/shared/constants/constants';
import { JobType, ModalActionType } from '@app/shared/enums/enums';
import { Experience } from '@app/shared/models/experience';
import { ExperienceService } from '@app/shared/services/experience.service';
import { ToastService } from '@app/shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-experience-modal',
  templateUrl: './experience-modal.component.html',
  styleUrl: './experience-modal.component.scss'
})
export class ExperienceModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedExperience: Experience | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  isSaving: boolean = false;
  updateMode: boolean = false;
  experienceForm: FormGroup;
  years: number[] = [];
  monthsList = months;
  jobTypesList = jobTypes;

  constructor(
    private fb: NonNullableFormBuilder,
    private experienceService: ExperienceService,
    private toastService: ToastService) {
    this.experienceForm = this.initExperienceForm();
  }

  ngOnInit() {
    this.generateYears();
    this.oncurrentlyWorkingChange();
    if (this.selectedExperience != undefined) {
      this.updateMode = true;
      this.populateForm(this.selectedExperience);
    }
  }

  private initExperienceForm(): FormGroup {
    return this.fb.group({
      companyName: ['', Validators.required],
      jobTitle: [''],
      type: [JobType.FullTime],
      startMonth: [0, this.nonZeroValidator],
      startYear: [0, this.nonZeroValidator],
      endMonth: [0],
      endYear: [0],
      currentlyWorking: [false],
      description: ['']
    }, {
      validators: [this.dateRangeValidator, this.endDateTwoFieldsValidator]
    });
  }

  private populateForm(experience: Experience): void {
    this.experienceForm.patchValue({
      companyName: experience.companyName,
      jobTitle: experience.jobTitle,
      type: experience.type,
      startMonth: experience.startMonth,
      startYear: experience.startYear,
      endMonth: experience.endMonth,
      endYear: experience.endYear,
      currentlyWorking: experience.currentlyWorking,
      description: experience.description,
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.experienceForm.valid) {
      this.isSaving = true;
      if (this.updateMode) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.experienceForm.markAllAsTouched();
    }
  }

  private oncurrentlyWorkingChange(): void {
    this.experienceForm.get('currentlyWorking')?.valueChanges.subscribe(currentlyWorking => {
      if (currentlyWorking) {
        this.experienceForm.get('endMonth')?.disable();
        this.experienceForm.get('endMonth')?.setValue(0);
        this.experienceForm.get('endYear')?.disable();
        this.experienceForm.get('endYear')?.setValue(0);
      } else {
        this.experienceForm.get('endMonth')?.enable();
        this.experienceForm.get('endYear')?.enable();
      }
    });
  }
  //#endregion


  private create(): void {
    const formValues = this.experienceForm.value;

    let experience = new Experience(formValues);

    this.experienceService.create(experience).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Creation of experience failed', error);
        }
      });
  }

  private update(): void {
    const formValues = this.experienceForm.value;

    let experience = new Experience(formValues);
    experience.id = this.selectedExperience?.id;

    this.experienceService.update(experience).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Update);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Update of experience failed', error);
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

    const currentlyWorking = formGroup.get('currentlyWorking')?.value;

    if (currentlyWorking) return null;

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