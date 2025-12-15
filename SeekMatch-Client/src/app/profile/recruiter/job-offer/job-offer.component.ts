import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { jobTypes, months, workplaceTypeList } from '../../../shared/constants/constants';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { JobApplicationStatus, JobOfferFilter, JobType, ModalActionType, WorkplaceType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';
import { JobApplication } from '../../../shared/models/job-application';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-job-offer',
  templateUrl: './job-offer.component.html',
  styleUrl: './job-offer.component.scss'
})
export class JobOfferComponent implements OnInit {

  public monthOptions = months;
  public JobApplicationStatus = JobApplicationStatus;
  public jobOffers: JobOffer[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public isViewingApplication = false;
  public selectedJobOffer: JobOffer = new JobOffer;
  public selectedJobApplication: JobApplication | null = new JobApplication;
  public selectedTalentId: string = '';
  public rejectionForm: FormGroup;
  public filterForm: FormGroup;
  public appliedFilters: any = {};
  public activeFilters: { key: JobOfferFilter, value: string }[] = [];
  public jobTypesList = jobTypes;
  public workplaceTypeList = workplaceTypeList;

  private deleteModal: NgbModalRef | undefined;
  private rejectModal: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private jobOfferService: JobOfferService,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService,
    private fb: NonNullableFormBuilder,
    private translate: TranslateService) {
    this.rejectionForm = this.initRejectionForm();
    this.filterForm = this.initFilterForm();
  }

  ngOnInit(): void {
    this.getJobOffers();
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  private initFilterForm(): FormGroup {
    return this.fb.group({
      title: [''],
      companyName: [''],
      type: [0],
      workplaceType: [0]
    });
  }

  private initRejectionForm(): FormGroup {
    return this.fb.group({
      reason: ['', Validators.required],
    });
  }

  //#region : Modal functions
  public openJobOfferPreviewModal(content: any, jobOffer: JobOffer): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
    this.selectedJobOffer = jobOffer;
  }

  public openJobOfferModal(event: MouseEvent, content: any, jobOffer?: JobOffer): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
    if (jobOffer != undefined) {
      this.selectedJobOffer = jobOffer;
    }

    event.stopPropagation();
  }

  public openTalentPreviewModal(content: any, jobApplication?: JobApplication): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
    if (jobApplication != undefined) {
      this.selectedJobApplication = jobApplication;
      if (!jobApplication.isExpress && jobApplication.talentId != undefined) {
        this.selectedTalentId = jobApplication.talentId;
      }
    }
  }

  public talentPreviewModalCloased(action: ModalActionType): void {
    if (action == ModalActionType.Close) {
      this.selectedTalentId = '';
      this.selectedJobApplication = null;
    }
  }

  public openDeleteModal(event: MouseEvent, content: any, experience: JobOffer): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedJobOffer = experience;

    event.stopPropagation();
  }

  public openRejectJobApplicationModal(content: any, jobApplication: JobApplication): void {
    this.rejectModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedJobApplication = jobApplication;
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Job offer created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Job offer updated successfully');
    }
    this.getJobOffers();
  }

  private closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }

  private closeRejectModal(): void {
    if (this.rejectModal) {
      this.rejectModal.close();
      this.rejectModal = undefined;
    }
  }
  //#endregion

  private getJobOffers(): void {
    this.jobOfferService.getAllByRecruiter().subscribe((jobOffers) => {
      this.jobOffers = jobOffers;
      this.isLoading = false;
    });
  }

  public deleteJobOffer(): void {
    this.isSaving = true;
    if (this.selectedJobOffer.id) {
      this.jobOfferService.delete(this.selectedJobOffer.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.closeDeleteModal();
            this.getJobOffers();
            this.toastService.showSuccessMessage('Job offer deleted successfully');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Deleting Job offer failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Job offer ID is undefined, cannot delete');
    }
  }

  public rejectJobApplication(): void {
    if (this.rejectionForm.invalid) {
      this.rejectionForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    if (this.selectedJobApplication && this.selectedJobApplication.id) {
      this.jobApplicationService.reject(this.selectedJobApplication.id, this.rejectionForm.value.reason).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.closeRejectModal();
            this.getJobOffers();
            this.toastService.showSuccessMessage('Job application rejected successfully');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Rejecting Job application failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Job application ID is undefined, cannot reject');
    }
  }

  public getJobTypeName(jobType: JobType): string {
    return JobType[jobType];
  }

  public getWorkplaceTypeName(workplaceType: WorkplaceType): string {
    return WorkplaceType[workplaceType];
  }

  public getJobApplicationStatus(jobApplicationStatus: JobApplicationStatus): string {
    return JobApplicationStatus[jobApplicationStatus];
  }

  public getStatusClass(jobApplicationStatus: JobApplicationStatus): string {
    switch (jobApplicationStatus) {
      case JobApplicationStatus.Submitted:
        return 'bg-warning';
      case JobApplicationStatus.Shortlisted:
        return 'bg-primary';
      case JobApplicationStatus.InterviewScheduled:
        return 'bg-info';
      case JobApplicationStatus.Hired:
        return 'bg-success';
      case JobApplicationStatus.Rejected:
        return 'bg-danger';
      case JobApplicationStatus.Withdrawn:
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  }

  public resetFilterForm(): void {
    this.filterForm.reset();
    this.appliedFilters = this.filterForm.value;
  }

  private computeActiveFilters(): void {
    this.activeFilters = [];

    const values = this.filterForm.value;

    if (values.title?.trim()) {
      this.activeFilters.push({ key: JobOfferFilter.Title, value: `Title: ${values.title}` });
    }

    if (values.companyName?.trim()) {
      this.activeFilters.push({ key: JobOfferFilter.Company, value: `Company: ${values.companyName}` });
    }

    if (values.type && values.type !== 0) {
      const jobType = this.jobTypesList.find(j => j.key === values.type);
      if (jobType) this.activeFilters.push({ key: JobOfferFilter.Type, value: `Type: ${this.translate.instant(jobType.value)}` });
    }

    if (values.workplaceType && values.workplaceType !== 0) {
      const workplace = this.workplaceTypeList.find(w => w.key === values.workplaceType);
      if (workplace) this.activeFilters.push({ key: JobOfferFilter.WorkplaceType, value: `Workplace: ${this.translate.instant(workplace.value)}` });
    }

  }

  public deleteFilter(filterKey: JobOfferFilter): void {
    switch (filterKey) {
      case JobOfferFilter.Title:
        this.filterForm.get('title')?.setValue('');
        break;
      case JobOfferFilter.Company:
        this.filterForm.get('companyName')?.setValue('');
        break;
      case JobOfferFilter.Type:
        this.filterForm.get('type')?.setValue(0);
        break;
      case JobOfferFilter.WorkplaceType:
        this.filterForm.get('workplaceType')?.setValue(0);
        break;
    }

    this.applyFilters();
  }

  public applyFilters(): void {
    this.appliedFilters = this.filterForm.value;
    this.computeActiveFilters();
  }

}
