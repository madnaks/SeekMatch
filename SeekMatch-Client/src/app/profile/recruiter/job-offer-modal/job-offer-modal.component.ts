import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup, NonNullableFormBuilder, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { months } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/jobOffer.service';

@Component({
  selector: 'app-job-offer-modal',
  templateUrl: './job-offer-modal.component.html',
  styleUrl: './job-offer-modal.component.scss'
})
export class JobOfferModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobOffer: JobOffer | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  isSaving: boolean = false;
  updateMode: boolean = false;
  jobOfferForm: FormGroup;
  years: number[] = [];
  monthsList = months;

  constructor(
    private fb: NonNullableFormBuilder,
    private jobOfferService: JobOfferService,
    private toastService: ToastService) {
    this.jobOfferForm = this.initJobOfferFormForm();
  }

  ngOnInit() {
    this.generateYears();
    this.oncurrentlyWorkingChange();
    if (this.selectedJobOffer != undefined) {
      this.updateMode = true;
      this.populateForm(this.selectedJobOffer);
    }
  }

  private initJobOfferFormForm(): FormGroup {
    return this.fb.group({
      title: [''],
      description: [''],
      companyName: [''],
      location: [''],
      salary: [0],
      postedAt: [ new Date()],
      expiresAt: [ new Date() ],
      isActive: [false],
    }, {
      validators: [this.dateRangeValidator, this.endDateTwoFieldsValidator]
    });
  }

  private populateForm(jobOffer: JobOffer): void {
    this.jobOfferForm.patchValue({
      title: jobOffer.title,
      description: jobOffer.description,
      companyName: jobOffer.companyName,
      location: jobOffer.location,
      salary: jobOffer.salary,
      postedAt: jobOffer.postedAt,
      expiresAt: jobOffer.expiresAt,
      type: jobOffer.type,
      isActive: jobOffer.isActive,
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.jobOfferForm.valid) {
      this.isSaving = true;
      if (this.updateMode) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.jobOfferForm.markAllAsTouched();
    }
  }

  private oncurrentlyWorkingChange(): void {
    this.jobOfferForm.get('currentlyWorking')?.valueChanges.subscribe(currentlyWorking => {
      if (currentlyWorking) {
        this.jobOfferForm.get('endMonth')?.disable();
        this.jobOfferForm.get('endMonth')?.setValue(0);
        this.jobOfferForm.get('endYear')?.disable();
        this.jobOfferForm.get('endYear')?.setValue(0);
      } else {
        this.jobOfferForm.get('endMonth')?.enable();
        this.jobOfferForm.get('endYear')?.enable();
      }
    });
  }
  //#endregion


  private create(): void {
    const formValues = this.jobOfferForm.value;

    let jobOffer = new JobOffer(formValues);

    this.jobOfferService.create(jobOffer).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Creation of job offer failed', error);
        }
      });
  }

  private update(): void {
    const formValues = this.jobOfferForm.value;

    let jobOffer = new JobOffer(formValues);
    jobOffer.id = this.selectedJobOffer?.id;

    this.jobOfferService.update(jobOffer).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Update);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Update of job offer failed', error);
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