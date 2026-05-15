import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EDITOR_MODULES, jobTypes, workplaceTypeList } from '../../../../shared/constants/constants';
import { ToastService } from '../../../../shared/services/toast.service';
import { JobType, ModalActionType, WorkplaceType } from '../../../../shared/enums/enums';
import { JobOffer } from '../../../../shared/models/job-offer';
import { JobOfferService } from '../../../../shared/services/job-offer.service';

@Component({
  selector: 'app-job-offer-modal',
  templateUrl: './job-offer-modal.component.html',
  styleUrl: './job-offer-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class JobOfferModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobOffer: JobOffer | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  isSaving: boolean = false;
  updateMode: boolean = false;
  jobOfferForm: FormGroup;
  jobTypesList = jobTypes;
  workplaceTypeList = workplaceTypeList;

  editorModules = EDITOR_MODULES;

  //#region  Stepping variables
  currentStep: number = 1;
  maxSteps: number = 3;
  stepValidationError: boolean = false;

  private readonly controlsByStep: Record<number, string[]> = {
    1: [
      'title',
      'type',
      'workplaceType',
      'location',
      'salary',
      'postedAt',
      'expiresAt',
      'isActive',
      'companyName',
      'companyInfo'
    ],
    2: [
      'description',
      'positionDetails'
    ],
    3: [
      'qualifications',
      'additionalRequirements'
    ]
  };
  //#endregion

  constructor(
    private fb: NonNullableFormBuilder,
    private jobOfferService: JobOfferService,
    private toastService: ToastService) {
    this.jobOfferForm = this.initJobOfferFormForm();
  }

  ngOnInit() {
    if (this.selectedJobOffer != undefined) {
      this.updateMode = true;
      this.populateForm(this.selectedJobOffer);
    }
  }

  private initJobOfferFormForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      companyName: [''],
      companyInfo: [''],
      positionDetails: [''],
      qualifications: [''],
      additionalRequirements: [''],
      location: ['', Validators.required],
      salary: [''],
      postedAt: [null],
      expiresAt: [null],
      type: [JobType.FullTime],
      workplaceType: [WorkplaceType.OnSite],
      isActive: [false],
    });
  }

  private populateForm(jobOffer: JobOffer): void {
    this.jobOfferForm.patchValue({
      title: jobOffer.title,
      description: jobOffer.description,
      companyName: jobOffer.companyName,
      companyInfo: jobOffer.companyInfo,
      positionDetails: jobOffer.positionDetails,
      qualifications: jobOffer.qualifications,
      additionalRequirements: jobOffer.additionalRequirements,
      location: jobOffer.location,
      salary: jobOffer.salary,
      postedAt: jobOffer.postedAt,
      expiresAt: jobOffer.expiresAt,
      type: jobOffer.type,
      workplaceType: jobOffer.workplaceType,
      isActive: jobOffer.isActive,
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.validateAllSteps()) {

      this.isSaving = true;

      const formValues = this.jobOfferForm.value;
      let jobOffer = new JobOffer(formValues);

      if (this.updateMode) {
        this.update(jobOffer);
      } else {
        this.create(jobOffer);
      }

    } else {
      const firstInvalidStep = this.getFirstInvalidStep();
      this.currentStep = firstInvalidStep ?? this.currentStep;
      this.markStepControlsAsTouched(this.currentStep);
      this.stepValidationError = true;
    }
  }
  //#endregion

  private create(jobOffer: JobOffer): void {

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

  private update(jobOffer: JobOffer): void {

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

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  //#region Stepping functions
  public goToNextStep(): void {
    if (!this.validateCurrentStep()) {
      this.stepValidationError = true;
      return;
    }

    this.stepValidationError = false;
    this.currentStep++;
  }

  public goToPreviousStep(): void {
    this.stepValidationError = false;
    this.currentStep--;
  }

  private validateCurrentStep(): boolean {
    this.markStepControlsAsTouched(this.currentStep);

    return this.getStepControls(this.currentStep).every((controlName) => {
      return this.jobOfferForm.get(controlName)?.valid ?? true;
    });
  }

  private validateAllSteps(): boolean {
    Object.keys(this.controlsByStep).forEach((step) => {
      this.markStepControlsAsTouched(Number(step));
    });

    return Object.keys(this.controlsByStep).every((step) => {
      return this.getStepControls(Number(step)).every((controlName) => {
        return this.jobOfferForm.get(controlName)?.valid ?? true;
      });
    });
  }

  private markStepControlsAsTouched(step: number): void {
    this.getStepControls(step).forEach((controlName) => {
      const control = this.jobOfferForm.get(controlName);

      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }

  private getFirstInvalidStep(): number | undefined {
    const invalidEntry = Object.entries(this.controlsByStep)
      .find(([, controlNames]) => {
        return controlNames.some((controlName) => {
          return this.jobOfferForm.get(controlName)?.invalid;
        });
      });

    return invalidEntry ? Number(invalidEntry[0]) : undefined;
  }

  private getStepControls(step: number): string[] {
    return this.controlsByStep[step] ?? [];
  }
  //#endregion
}
