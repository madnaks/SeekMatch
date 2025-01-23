import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { months } from '../../../shared/constants/constants';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { JobType, ModalActionType } from '../../../shared/enums/enums';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobOfferService } from '../../../shared/services/job-offer.service';

@Component({
  selector: 'app-job-offer',
  templateUrl: './job-offer.component.html',
  styleUrl: './job-offer.component.scss'
})
export class JobOfferComponent implements OnInit {

  public monthOptions = months;
  public jobOffers: JobOffer[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedJobOffer: JobOffer = new JobOffer;
  
  private deleteModal: NgbModalRef | undefined;
  
  constructor(
    private modalService: NgbModal, 
    private jobOfferService: JobOfferService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getJobOffers();
  }

  //#region : Modal functions
  public open(content: any, jobOffer?: JobOffer): void {
    this.modalService.open(content, { centered: true, backdrop: 'static', size: 'xl' });
    if (jobOffer != undefined) {
      this.selectedJobOffer = jobOffer;
    }
  }

  public openDeleteModal(content: any, experience: JobOffer): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedJobOffer = experience;
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Job offer created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Job offer updated successfully');
    }
    this.getJobOffers();
  }

  private closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }
  //#endregion

  private getJobOffers(): void {
    this.jobOfferService.getAllByRecruiter().subscribe((jobOffers) => {
      this.jobOffers = jobOffers;
      this.isLoading = false;
    });
  }

  public deleteJobOffer(): void {
    this.isSaving = true;
    if (this.selectedJobOffer.id) {
      this.jobOfferService.delete(this.selectedJobOffer.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.closeModal();
            this.getJobOffers();
            this.toastService.showSuccessMessage('Job offer deleted successfully');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Deleting Job offer failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Job offer ID is undefined, cannot delete');
    }
  }

  public getJobTypeName(type: JobType): string {
    return JobType[type];
  }


}
