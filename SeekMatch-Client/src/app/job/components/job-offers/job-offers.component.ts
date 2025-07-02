import { Component, OnInit } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.scss'
})
export class JobOffersComponent implements OnInit {

  public selectedJobOffer: JobOffer | null = null;
  public isMobileView: boolean = false;
  public showDetailsOnMobile: boolean = false;

  ngOnInit(): void {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView.bind(this));
  }

  private checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  public onJobOfferSelected(jobOffer: any): void {
    this.selectedJobOffer = jobOffer;
    if (this.isMobileView) {
      this.showDetailsOnMobile = true;
    }
  }

}
