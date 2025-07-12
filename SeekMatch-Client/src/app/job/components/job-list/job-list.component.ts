import { Component, EventEmitter, Input, Output } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';
import { WorkplaceType } from '../../../shared/enums/enums';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent {

  @Input() isMobileView: boolean = false;
  @Input()
  set filters(value: any) {
    this._filters = value;
    this.loadJobOffers();
  }
  @Output() jobOfferSelected = new EventEmitter<any>();

  public jobOffers: JobOffer[] = [];
  public isLoading: boolean = false;
  public selectedJobOffer: JobOffer | null = null;
  
  private _filters: any;

  constructor(private jobOfferService: JobOfferService) { }

  private loadJobOffers(): void {
    this.isLoading = true;
    this.jobOfferService.getAll(this._filters).subscribe((newJobs) => {
      this.jobOffers = [...newJobs];
      if (this.jobOffers.length > 0 && !this.isMobileView) {
        this.selectJobOffer(this.jobOffers[0]);
      } else if (this.jobOffers.length == 0) {
        this.selectJobOffer(null);
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
