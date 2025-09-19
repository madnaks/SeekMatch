import { Component, OnInit } from '@angular/core';
import { JobApplication } from '../../../shared/models/job-application';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { JobApplicationStatus } from '../../../shared/enums/enums';

@Component({
  selector: 'app-job-application',
  templateUrl: './job-application.component.html',
  styleUrl: './job-application.component.scss'
})
export class JobApplicationComponent implements OnInit {

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

  public getJobApplicationStatus(status: JobApplicationStatus): string {
    return JobApplicationStatus[status];
  }

  public getStatusClass(status: JobApplicationStatus): string {
    switch (status) {
      case JobApplicationStatus.Submitted:
        return 'bg-warning';
      case JobApplicationStatus.Shortlisted:
        return 'bg-primary';
      case JobApplicationStatus.InterviewScheduled:
        return 'bg-info';
      case JobApplicationStatus.Offered:
        return 'bg-success';
      case JobApplicationStatus.Rejected:
        return 'bg-danger';
      case JobApplicationStatus.Withdrawn:
        return 'bg-secondary';
      default:
        return 'bg-light';
    }
  }


}
