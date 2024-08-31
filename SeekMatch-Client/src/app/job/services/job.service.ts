import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Job } from '../job';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private selectedJob = new BehaviorSubject<any>(null);
  selectedJob$ = this.selectedJob.asObservable();
  private jobsUrl = 'assets/mock/jobs.json';

  constructor(private http: HttpClient) { }

  getJobs(page: number) {
    return this.http.get<Job[]>(this.jobsUrl);
    // API Call :return this.http.get<any[]>(`/api/jobs?page=${page}`);
  }

  setSelectedJob(job: any) {
    this.selectedJob.next(job);
  }
}
