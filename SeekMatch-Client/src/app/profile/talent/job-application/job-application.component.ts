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
  sortedJobApplications = [...this.jobApplications];
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private jobApplicationService: JobApplicationService) {
  }

  ngOnInit(): void {
    this.getJobApplications();
  }

  private getJobApplications(): void {
    this.jobApplicationService.getAllByTalent().subscribe((jobApplications) => {
      this.jobApplications = jobApplications;
      this.sortedJobApplications = [...this.jobApplications];
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

  sortData(column: keyof JobApplication) {
    if (this.sortColumn === column) {
      // Toggle direction if sorting same column again
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // New column to sort
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.sortedJobApplications = [...this.jobApplications].sort((a, b) => {
      const valueA = a[column];
      const valueB = b[column];
      if (valueA == null || valueB == null) return 0;

      let comparison = 0;

      // Compare based on type
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        comparison = valueA === valueB ? 0 : valueA ? 1 : -1;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else {
        // For enums, dates, or other values
        comparison = String(valueA).localeCompare(String(valueB));
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }


}
