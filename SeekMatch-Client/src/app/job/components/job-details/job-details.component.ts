import { Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobType, WorkplaceType } from '../../../shared/enums/enums';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';
import { JobApplicationService } from '../../../shared/services/job-application.service';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JobOfferService } from '@app/shared/services/job-offer.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit, OnChanges {

  @Input() jobOffer: JobOffer | null = null;
  @Input() isMobileView: boolean = false;

  @ViewChild('expressApplyContent') expressApplyContent!: TemplateRef<any>;
  @ViewChild('loginModalContent') loginModalContent!: TemplateRef<any>;

  public canApply: boolean = false;
  public isSaving: boolean = false;
  public isBookmarked: boolean = false;
  public isAunthenticated: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private jobApplicationService: JobApplicationService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private jobOfferService: JobOfferService) {
      this.isAunthenticated = this.authService.isAuthenticated();
  }

  ngOnInit(): void {
    this.canApply = this.authService.canApply();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['jobOffer'] && this.isAunthenticated) {
      this.jobOfferService.isBookmarked(this.jobOffer?.id || '').subscribe((isBookmarked) => {
        this.isBookmarked = isBookmarked;
      });
    }
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
      this.modalService.open(this.expressApplyContent, { centered: true, backdrop: 'static'});
    }
  }

  public bookmark(): void {
    if (this.authService.isAuthenticated()) {
      this.jobOfferService.bookmark(this.jobOffer?.id || '').subscribe({
        next: () => {
          this.isBookmarked = true;
          this.toastService.showSuccessMessage('Bookmarked successfully!');
        },
        error: (error) => {
          this.toastService.showErrorMessage('Error while bookmarking!', error);  
          this.isBookmarked = false;
        }
      });
    } else {
      this.modalService.open(this.loginModalContent, { centered: true, backdrop: 'static' });
    }
  }

  public unbookmark(): void {
    this.jobOfferService.unbookmark(this.jobOffer?.id || '').subscribe({
      next: () => {
        this.isBookmarked = false;
        this.toastService.showSuccessMessage('Unbookmarked successfully!');
      },
      error: (error) => {
        this.toastService.showErrorMessage('Error while unbookmarking!', error);
        this.isBookmarked = true;
      }
    });
  }
}
