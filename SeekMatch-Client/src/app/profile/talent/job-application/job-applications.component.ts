import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { JobApplication } from '../../../shared/models/job-application';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { TableColumn } from '@app/shared/form-controls/data-table/data-table.component';
import { JobApplicationsColumns } from './job-applications.config';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobOfferService } from '@app/shared/services';
import { JobOffer } from '@app/shared/models/job-offer';

@Component({
  selector: 'app-job-applications',
  templateUrl: './job-applications.component.html',
  styleUrl: './job-applications.component.scss'
})
export class JobApplicationsComponent implements OnInit {

  public jobApplicationsColumns: TableColumn<JobApplication>[] = JobApplicationsColumns;
  public jobApplications: JobApplication[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedJobOffer: JobOffer = new JobOffer;
  public jobOfferLoading: boolean = false;

  @ViewChild('previewJobOfferContent') previewJobOfferContent!: TemplateRef<any>;

  constructor(
    private jobApplicationService: JobApplicationService,
    private modalService: NgbModal,
    private jobOfferService: JobOfferService) {
  }

  ngOnInit(): void {
    this.getJobApplications();
  }

  private getJobApplications(): void {
    this.jobApplicationService.getAllByTalent().subscribe((jobApplications) => {
      this.jobApplications = jobApplications;
      this.isLoading = false;
    });
  }

  public viewJobOffer(jobApplication: JobApplication): void {
    
    if (!jobApplication.jobOfferId) {
      return;
    }

    this.jobOfferLoading = true;

    this.jobOfferService.getById(jobApplication.jobOfferId).subscribe((jobOffer: JobOffer) => {
      this.selectedJobOffer = jobOffer;
      this.jobOfferLoading = false;
    });

    this.modalService.open(this.previewJobOfferContent, { centered: true, backdrop: 'static', size: 'xl' });
  }

  public rowClicked(jobApplication: JobApplication): void {
    this.viewJobOffer(jobApplication);
  }
}
