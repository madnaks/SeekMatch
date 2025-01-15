import { Component } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';

@Component({
  selector: 'app-job-offers',
  templateUrl: './job-offers.component.html',
  styleUrl: './job-offers.component.scss'
})
export class JobOffersComponent {

  selectedJobOffer: JobOffer | null = null;

  onJobOfferSelected(jobOffer: any) {
    this.selectedJobOffer = jobOffer;
  }

}
