import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ModalActionType } from '@app/shared/enums/enums';
import { JobApplication } from '@app/shared/models/job-application';
import { JobApplicationService } from '@app/shared/services/job-application.service';
import { ToastService } from '@app/shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reject-job-application-modal',
  templateUrl: './reject-job-application-modal.component.html',
  styleUrl: './reject-job-application-modal.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class RejectJobApplicationModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobApplication: JobApplication | null = null;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  public rejectionForm: FormGroup;
  public isSaving: boolean = false;

  constructor(private fb: NonNullableFormBuilder,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService) {
    this.rejectionForm = this.initRejectionForm();
  }

  ngOnInit() {
  }

  private initRejectionForm(): FormGroup {
    return this.fb.group({
      reason: ['', Validators.required],
    });
  }

  public rejectJobApplication(): void {
    if (this.rejectionForm.invalid) {
      this.rejectionForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    if (this.selectedJobApplication && this.selectedJobApplication.id) {
      this.jobApplicationService.reject(this.selectedJobApplication.id, this.rejectionForm.value.reason).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.dismiss();
            this.toastService.showSuccessMessage('Job application rejected successfully');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Rejecting Job application failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Job application ID is undefined, cannot reject');
    }
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}