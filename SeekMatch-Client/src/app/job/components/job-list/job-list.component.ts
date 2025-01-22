import { Component, EventEmitter, Output } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/jobOffer.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  @Output() jobOfferSelected = new EventEmitter<any>();

  jobOffers: JobOffer[] = [];
  isLoading: boolean = false;
  selectedJobOffer: JobOffer | null = null;

  constructor(private jobOfferService: JobOfferService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadJobOffers();
  }

  private loadJobOffers():void {
    this.isLoading = true;
    this.jobOfferService.getAll().subscribe((newJobs) => {
      this.jobOffers = [...this.jobOffers, ...newJobs];
      if (this.jobOffers.length > 0) {
        this.selectJobOffer(this.jobOffers[0]);
      }
      this.isLoading = false;
    });
  }

  public selectJobOffer(jobOffer: any): void {
    this.selectedJobOffer = jobOffer;
    this.jobOfferSelected.emit(jobOffer);
  }

}
