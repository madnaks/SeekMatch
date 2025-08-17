import { Component, Input } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { JobApplicationService } from '@app/shared/services/job-application.service';
import { ToastService } from '@app/shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-express-apply-modal',
  templateUrl: './express-apply-modal.component.html',
  styleUrl: './express-apply-modal.component.scss'
})
export class ExpressApplyModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() jobOfferId: string | undefined = '';

  public expressApplyMode: boolean = false;
  public expressApplyForm: FormGroup;
  public isSaving: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService) {
    this.expressApplyForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['']
    });
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  public onSubmit(): void {
    if (this.expressApplyForm.valid) {
      this.isSaving = true;

      const expressApplyData = this.expressApplyForm.value;
      const phoneNumberObject = expressApplyData.phone;
      const formattedPhoneNumber = phoneNumberObject?.internationalNumber || '';
      expressApplyData.phone = formattedPhoneNumber;

      this.jobApplicationService.expressApply(this.jobOfferId, expressApplyData).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.toastService.showSuccessMessage('Applied successfully!');
            this.dismiss();
          },
          error: (error) => {
            this.toastService.showErrorMessage('Error while applying!', error);
            this.dismiss();
          }
        });

    } else {
      this.expressApplyForm.markAllAsTouched();
    }

  }
}