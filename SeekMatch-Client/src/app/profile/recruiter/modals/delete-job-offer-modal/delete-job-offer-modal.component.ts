import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ModalActionType } from '@app/shared/enums/enums';
import { JobOffer } from '@app/shared/models/job-offer';
import { JobOfferService } from '@app/shared/services/job-offer.service';
import { ToastService } from '@app/shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-delete-job-offer-modal',
  templateUrl: './delete-job-offer-modal.component.html',
  styleUrl: './delete-job-offer-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class DeleteJobOfferModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobOffer: JobOffer | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  isSaving: boolean = false;
  updateMode: boolean = false;

  constructor(
    private jobOfferService: JobOfferService,
    private toastService: ToastService) {
  }

  ngOnInit() {
  }

  public deleteJobOffer(): void {
    this.isSaving = true;
    if (this.selectedJobOffer && this.selectedJobOffer.id) {
      this.jobOfferService.delete(this.selectedJobOffer.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.dismiss();
            this.modalActionComplete.emit(ModalActionType.Delete);
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

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}