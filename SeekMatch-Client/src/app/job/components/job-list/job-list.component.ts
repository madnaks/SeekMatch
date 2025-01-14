import { Component, EventEmitter, Output } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/jobOffer.service';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  @Output() jobOfferSelected = new EventEmitter<any>();

  jobOffers: JobOffer[] = [];
  isLoading: boolean = false;

  constructor(private jobOfferService: JobOfferService) { }

  ngOnInit() {
    this.loadJobOffers();
  }

  private loadJobOffers():void {
    this.isLoading = true;
    this.jobOfferService.getAll().subscribe((newJobs) => {
      this.jobOffers = [...this.jobOffers, ...newJobs];
      this.isLoading = false;
    });
  }

  public selectJobOffer(jobOffer: any): void {
    this.jobOfferSelected.emit(jobOffer);
  }

}
