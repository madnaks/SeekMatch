import { Component, HostListener } from '@angular/core';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {
  jobs: any[] = [];
  page: number = 1;
  isLoading: boolean = false;

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService.getJobs(this.page).subscribe((newJobs) => {
      this.jobs = [...this.jobs, ...newJobs];
      this.isLoading = false;
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (!this.isLoading) {
        this.page++;
        this.loadJobs();
      }
    }
  }

  selectJob(job: any) {
    this.jobService.setSelectedJob(job);
  }

}
