import { Component, OnInit } from '@angular/core';
import { JobApplication } from '../../../shared/models/job-application';
import { JobApplicationService } from '../../../shared/services/job-application.service';

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

}
