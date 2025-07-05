import { Component, OnInit } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.scss'
})
export class JobOffersComponent implements OnInit {

  public selectedJobOffer: JobOffer | null = null;
  public isMobileView: boolean = false;
  public showDetailsOnMobile: boolean = false;
  public canApply: boolean = false;
  public isSaving: boolean = false;
  
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView.bind(this));
    this.canApply = this.authService.canApply();
  }

  private checkMobileView(): void {
    this.isMobileView = window.innerWidth < 768;
    if (this.isMobileView) {
      this.selectedJobOffer = null;
    }
  }

  public onJobOfferSelected(jobOffer: any): void {
    this.selectedJobOffer = jobOffer;
    if (this.isMobileView) {
      this.showDetailsOnMobile = true;
    }
  }

}
