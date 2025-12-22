import { Component, OnInit } from '@angular/core';
import { JobApplication } from '../../../shared/models/job-application';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { TableColumn } from '@app/shared/form-controls/data-table/data-table.component';
import { JobApplicationsColumns } from './job-applications.config';

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
  public selectedJobApplication: JobApplication = new JobApplication;

  constructor(
    private jobApplicationService: JobApplicationService) {
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
}
