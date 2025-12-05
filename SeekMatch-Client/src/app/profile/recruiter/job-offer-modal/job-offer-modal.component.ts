import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EDITOR_MODULES, jobTypes, workplaceTypeList } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { JobType, ModalActionType, WorkplaceType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';

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
    if (this.jobOfferForm.valid) {

      this.isSaving = true;

      const formValues = this.jobOfferForm.value;
      let jobOffer = new JobOffer(formValues);

      if (this.updateMode) {
        this.update(jobOffer);
      } else {
        this.create(jobOffer);
      }

    } else {
      this.jobOfferForm.markAllAsTouched();
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
    this.currentStep++;
    // this.updateModalSize();
  }

  public goToPreviousStep(): void {
    this.currentStep--;
    // this.updateModalSize();
  }

  private updateModalSize(): void {
    const modalElement = document.querySelector('.modal-dialog');
    if (modalElement) {
      if (this.currentStep === 2) {
        modalElement.classList.add('modal-xl'); // Add xl size at step 3
      } else {
        modalElement.classList.remove('modal-xl'); // Remove xl size at other steps
      }
    }
  }
  //#endregion
}