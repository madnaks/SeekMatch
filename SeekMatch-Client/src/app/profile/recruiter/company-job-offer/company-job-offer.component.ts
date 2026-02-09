import { Component, OnInit } from '@angular/core';
import { jobTypes, workplaceTypeList } from '../../../shared/constants/constants';
import { JobType, WorkplaceType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-job-offer',
  templateUrl: './company-job-offer.component.html',
  styleUrl: './company-job-offer.component.scss'
})
export class CompanyJobOfferComponent implements OnInit {

  public jobOffers: JobOffer[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedJobOffer: JobOffer = new JobOffer;

  public jobTypesList = jobTypes;
  public workplaceTypeList = workplaceTypeList;

  constructor(
    private jobOfferService: JobOfferService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getJobOffers();
  }

  private getJobOffers(): void {
    this.jobOfferService.getAllByCompany().subscribe((jobOffers) => {
      this.jobOffers = jobOffers;
      this.isLoading = false;
    });
  }

  public getJobTypeName(jobType: JobType): string {
    return JobType[jobType];
  }

  public getWorkplaceTypeName(workplaceType: WorkplaceType): string {
    return WorkplaceType[workplaceType];
  }

  public navigateToJobOfferDetail(jobOffer: JobOffer): void {
    this.selectedJobOffer = jobOffer;

    const currentUrl = this.router.url;

    if (currentUrl.includes('profile/recruiter')) {
      this.router.navigate(['/profile/recruiter/company-job-offer/details', jobOffer.id], { state: { jobOffer: jobOffer } });
    } else if (currentUrl.includes('profile/representative')) {
      this.router.navigate(['/profile/representative/company-job-offer/details', jobOffer.id], { state: { jobOffer: jobOffer } });
    }
  }

}
