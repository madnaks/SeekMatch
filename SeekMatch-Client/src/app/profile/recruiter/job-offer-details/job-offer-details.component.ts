import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { jobTypes, months, workplaceTypeList } from '../../../shared/constants/constants';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { JobApplicationStatus, JobOfferFilter, JobType, ModalActionType, WorkplaceType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobApplication } from '../../../shared/models/job-application';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
  styleUrl: './job-offer-details.component.scss'
})
export class JobOfferDetailsComponent implements OnInit {

  public monthOptions = months;
  public JobApplicationStatus = JobApplicationStatus;
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public jobOffer: JobOffer = new JobOffer;
  public selectedJobApplication: JobApplication | null = new JobApplication;
  public selectedTalentId: string = '';
  public filterForm: FormGroup;
  public appliedFilters: any = {};
  public activeFilters: { key: JobOfferFilter, value: string }[] = [];
  public jobTypesList = jobTypes;
  public workplaceTypeList = workplaceTypeList;


  constructor(
    private modalService: NgbModal,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService,
    private fb: NonNullableFormBuilder,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute) {
    this.filterForm = this.initFilterForm();

    const nav = this.router.getCurrentNavigation();
    this.jobOffer = nav?.extras?.state?.['jobOffer'];

    if (!this.jobOffer) {
      const id = this.route.snapshot.paramMap.get('id');
      // call API only if needed
    }

    this.isLoading = false;
  }

  ngOnInit(): void {
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

  //#region : Modal functions
  public openJobOfferPreviewModal(content: any): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
  }

  public openJobOfferModal(content: any): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
  }
  
   public openDeleteModal(content: any): void {
     this.modalService.open(content, { centered: true, backdrop: 'static' });
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

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Job offer created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Job offer updated successfully');
    } else if (action == ModalActionType.Delete) {
      this.goBack();
    }
  }
  //#endregion

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

  public goBack(): void {
    this.router.navigate(['/profile/recruiter/job-offer']);
  }

}
