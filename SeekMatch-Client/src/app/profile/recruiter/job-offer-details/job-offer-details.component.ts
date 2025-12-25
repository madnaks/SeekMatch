import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jobTypes, workplaceTypeList } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { JobApplicationStatus, JobType, ModalActionType, WorkplaceType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobApplication } from '../../../shared/models/job-application';
import { FormBuilder, FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { JobOfferService } from '@app/shared/services/job-offer.service';

@Component({
  selector: 'app-job-offer-details',
  templateUrl: './job-offer-details.component.html',
  styleUrl: './job-offer-details.component.scss'
})
export class JobOfferDetailsComponent implements OnInit {

  public JobApplicationStatus = JobApplicationStatus;
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public jobOffer: JobOffer = new JobOffer;
  public selectedJobApplication: JobApplication | null = new JobApplication;
  public selectedTalentId: string = '';
  public jobTypesList = jobTypes;
  public workplaceTypeList = workplaceTypeList;
  public filterForm!: FormGroup;
  // public statuses = ['Hired', 'Rejected', 'Submitted', 'Interview', 'Shortlisted'];
  public statuses: string[] = [];
  public filteredJobApplications: JobApplication[] = [];

  constructor(
    private modalService: NgbModal,
    private toastService: ToastService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private jobOfferService: JobOfferService) {

    this.statuses = Object.keys(JobApplicationStatus).filter(k => isNaN(Number(k)));

    const nav = this.router.getCurrentNavigation();
    this.jobOffer = nav?.extras?.state?.['jobOffer'];

    if (!this.jobOffer) {
      const id = this.route.snapshot.paramMap.get('id');
      // call API only if needed
      if (id) {
        this.jobOfferService.getById(id).subscribe((jobOffer: JobOffer) => {
          this.jobOffer = jobOffer;
          this.filteredJobApplications = this.jobOffer.jobApplications;
          this.isLoading = false;
        });
      }
    } else {

      this.filteredJobApplications = this.jobOffer.jobApplications;

      this.isLoading = false;
    }
  }

  ngOnInit(): void {
    const controls: any = {};

    this.statuses.forEach(status => {
      controls[status] = false;
    });

    this.filterForm = this.fb.group(controls);

    this.filterForm.valueChanges.subscribe(value => {
      this.onFilterChanged(value);
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

  public openJobApplicationDetailsModal(content: any, jobApplication?: JobApplication): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
    if (jobApplication != undefined) {
      this.selectedJobApplication = jobApplication;
      if (!jobApplication.isExpress && jobApplication.talentId != undefined) {
        this.selectedTalentId = jobApplication.talentId;
      }
    }
  }

  public jobApplicationDetailsModalCloased(action: ModalActionType): void {
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

  public goBack(): void {
    this.router.navigate(['/profile/recruiter/job-offer']);
  }

  onFilterChanged(value: any) {
    const selectedStatuses = this.statuses.filter(
      status => value[status]
    );
    if (selectedStatuses.length === 0) {
      this.filteredJobApplications = this.jobOffer.jobApplications;
    } else {
      this.filteredJobApplications = this.jobOffer.jobApplications.filter(ja => selectedStatuses.includes(JobApplicationStatus[ja.status]));

    }
  }


}
