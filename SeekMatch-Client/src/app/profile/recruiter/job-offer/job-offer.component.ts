import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { jobTypes, workplaceTypeList } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { JobType, ModalActionType, WorkplaceType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-offer',
  templateUrl: './job-offer.component.html',
  styleUrl: './job-offer.component.scss'
})
export class JobOfferComponent implements OnInit {

  public jobOffers: JobOffer[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedJobOffer: JobOffer = new JobOffer;

  public jobTypesList = jobTypes;
  public workplaceTypeList = workplaceTypeList;

  constructor(
    private modalService: NgbModal,
    private jobOfferService: JobOfferService,
    private toastService: ToastService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getJobOffers();
  }

  //#region : Modal functions
  public openAddJobOfferModal(content: any, jobOffer?: JobOffer): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
    if (jobOffer != undefined) {
      this.selectedJobOffer = jobOffer;
    }
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Job offer created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Job offer updated successfully');
    }
    this.getJobOffers();
  }
  //#endregion

  private getJobOffers(): void {
    this.jobOfferService.getAllByRecruiter().subscribe((jobOffers) => {
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
    this.router.navigate(['/profile/recruiter/job-offer/details', jobOffer.id], { state: { jobOffer: jobOffer } });
  }

}
