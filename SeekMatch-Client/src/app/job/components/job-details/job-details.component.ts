import { Component, Input, OnInit } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobType, WorkplaceType } from '../../../shared/enums/enums';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {

  @Input() jobOffer: JobOffer | null = null;
  @Input() isMobileView: boolean = false;
  
  public canApply: boolean = false;
  public isSaving: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.canApply = this.authService.canApply();
  }

  public getJobTypeName(type: JobType): string {
    return JobType[type];
  }

  public getWorkplaceTypeName(workplaceType: WorkplaceType): string {
    return WorkplaceType[workplaceType];
  }

  public sanitizedDescription(description: string) {
    const normalizedDescription = description.replace(/&nbsp;/g, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(normalizedDescription);
  }

  public apply(): void {
    if (this.authService.isAuthenticated()) {
      this.isSaving = true;
      this.jobApplicationService.apply(this.jobOffer?.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.toastService.showSuccessMessage('Applied successfully!');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Error while applying!', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('You must be authenticated!');
    }
  }
}
