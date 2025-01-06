import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';
import { jobTypes } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { JobType, ModalActionType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/jobOffer.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

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
  jobTypesList = jobTypes;
  bsConfig?: Partial<BsDatepickerConfig>;

  constructor(
    private fb: NonNullableFormBuilder,
    private jobOfferService: JobOfferService,
    private toastService: ToastService) {
    this.jobOfferForm = this.initJobOfferFormForm();
    this.configureDatePicker();
  }

  ngOnInit() {
    if (this.selectedJobOffer != undefined) {
      this.updateMode = true;
      this.populateForm(this.selectedJobOffer);
    }
  }

  private configureDatePicker(): void {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'YYYY-MM-DD',
      isAnimated: true,
      showWeekNumbers: false,
    });
  }

  private initJobOfferFormForm(): FormGroup {
    return this.fb.group({
      title: [''],
      description: [''],
      companyName: [''],
      location: [''],
      salary: [''],
      postedAt: [new Date()],
      expiresAt: [new Date()],
      type: [JobType.FullTime],
      isActive: [false],
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

    debugger

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
}