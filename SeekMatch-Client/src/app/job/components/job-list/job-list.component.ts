import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';
import { DomSanitizer } from '@angular/platform-browser';
import { WorkplaceType } from '../../../shared/enums/enums';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  @Input() isMobileView: boolean = false;
  @Output() jobOfferSelected = new EventEmitter<any>();

  jobOffers: JobOffer[] = [];
  isLoading: boolean = false;
  selectedJobOffer: JobOffer | null = null;

  constructor(private jobOfferService: JobOfferService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadJobOffers();
  }

  private loadJobOffers(): void {
    this.isLoading = true;
    this.jobOfferService.getAll().subscribe((newJobs) => {
      this.jobOffers = [...this.jobOffers, ...newJobs];
      if (this.jobOffers.length > 0 && !this.isMobileView) {
        this.selectJobOffer(this.jobOffers[0]);
      }
      this.isLoading = false;
    });
  }

  public selectJobOffer(jobOffer: any): void {
    this.selectedJobOffer = jobOffer;
    this.jobOfferSelected.emit(jobOffer);
  }

  public getWorkplaceTypeName(workplaceType: WorkplaceType): string {
    return WorkplaceType[workplaceType];
  }
}
