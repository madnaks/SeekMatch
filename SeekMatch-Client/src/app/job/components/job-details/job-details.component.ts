import { Component } from '@angular/core';
import { JobService } from '../../services/job.service';
import { Job } from '../../../shared/models/job';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent {
  job: Job | null = null;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    // Subscribe to changes in the selected job
    this.jobService.selectedJob$.subscribe(selectedJob => {
      this.job = selectedJob;
    });
  }


}
