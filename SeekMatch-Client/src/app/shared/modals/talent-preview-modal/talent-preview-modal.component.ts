import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../constants/constants';
import { Education } from '../../models/education';
import { Experience } from '../../models/experience';
import { JobApplicationStatus, ModalActionType } from '@app/shared/enums/enums';
import { JobApplicationService } from '@app/shared/services/job-application.service';
import { HttpResponse } from '@angular/common/http';
import { JobApplication } from '@app/shared/models/job-application';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastService } from '@app/shared/services/toast.service';

@Component({
  selector: 'app-talent-preview-modal',
  templateUrl: './talent-preview-modal.component.html',
  styleUrl: './talent-preview-modal.component.scss'
})
export class TalentPreviewModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedTalent: Talent | null = null;
  @Input() selectedTalentId: string = "";
  @Input() jobApplication: JobApplication | null = null;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  @ViewChild('shortListedConfirmationModal') shortListedConfirmationModal!: TemplateRef<any>;
  @ViewChild('interviewScheduledModal') interviewScheduledModal!: TemplateRef<any>;
  @ViewChild('rejectJobApplicationModal') rejectJobApplicationModal!: TemplateRef<any>;

  public currentTalent: Talent | null = null;
  public profilePicture: SafeUrl | string | null = null;
  public isSummaryExpanded = false;
  public isExpressApplication: boolean = false;
  public monthOptions = months;
  public resumeUrl: SafeResourceUrl | null = null;
  public showResume: boolean = false;
  public JobApplicationStatus = JobApplicationStatus;
  public rejectionForm: FormGroup;
  public isSaving: boolean = false;
  public jobApplicationSteps = [
    { icon: 'fas fa-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.SUBMITTED' },
    { icon: 'fa-solid fa-list-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.SHORTLISTED' },
    { icon: 'fa-solid fa-calendar-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.INTERVIEW-SCHEDULED' },
    { icon: 'fa-solid fa-handshake', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.HIRED' },
    { icon: 'fas fa-xmark', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.REJECTED' }
  ];
  public platforms = [
    { name: 'Tearms', icon: 'fa-brands fa-microsoft' },
    { name: 'Google Meet', icon: 'fa-brands fa-google' },
    { name: 'Zoom', icon: 'fa-brands fa-zoom' },
    { name: 'Skype', icon: 'fa-brands fa-skype' },
    { name: 'Other', icon: 'fa-solid fa-link' }
  ];

  constructor(
    private talentService: TalentService,
    private jobApplicationService: JobApplicationService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private modalService: NgbModal,
    private fb: NonNullableFormBuilder,
    private toastService: ToastService) {
    this.rejectionForm = this.initRejectionForm();
  }

  ngOnInit(): void {
    // If came from job offer applications list
    if (this.jobApplication) {
      if (this.jobApplication.expressApplication && this.selectedTalent == null) {
        this.isExpressApplication = true;
      } else {
        if (this.selectedTalentId !== "") {
          this.talentService.getById(this.selectedTalentId).subscribe(talent => {
            this.currentTalent = new Talent(talent);
            this.loadProfilePicture();
          });
        }
      }
    }
    // If came from talent profile 
    else if (this.selectedTalent !== null) {
      this.currentTalent = this.selectedTalent;
      this.loadProfilePicture();
    }
  }

  private initRejectionForm(): FormGroup {
    return this.fb.group({
      reason: ['', Validators.required],
    });
  }


  private loadProfilePicture(): void {
    if (this.currentTalent?.profilePicture) {
      this.profilePicture = `data:image/jpeg;base64,${this.currentTalent.profilePicture}`;
    } else {
      this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
    }
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
      this.modalActionComplete.emit(ModalActionType.Close);
      this.dismissModal(reason);
    }
  }

  public get hasLongSummary(): boolean {
    return !!this.currentTalent?.summary && this.currentTalent.summary.length > 150;
  }

  public getMonthName(monthId: number): string {
    const month = this.monthOptions.find(m => m.id === monthId);
    return month ? this.translate.instant(month.value) : '';
  }


  public getEducationDuration(education: Education): string {
    if (education.currentlyStudying) {
      return this.getMonthName(education.startMonth) + ' ' + education.startYear + ' - '
        + this.translate.instant('Date.Today');
    } else if (education.endMonth > 0 && education.endYear > 0) {
      return this.getMonthName(education.startMonth) + ' ' + education.startYear + ' - '
        + this.getMonthName(education.endMonth) + ' ' + education.endYear
    } else {
      return this.getMonthName(education.startMonth) + ' ' + education.startYear
    }
  }

  public getExperienceDuration(experience: Experience): string {
    if (experience.currentlyWorking) {
      return this.getMonthName(experience.startMonth) + ' ' + experience.startYear + ' - '
        + this.translate.instant('Date.Today');
    } else if (experience.endMonth > 0 && experience.endYear > 0) {
      return this.getMonthName(experience.startMonth) + ' ' + experience.startYear + ' - '
        + this.getMonthName(experience.endMonth) + ' ' + experience.endYear
    } else {
      return this.getMonthName(experience.startMonth) + ' ' + experience.startYear
    }
  }

  public onShowResume(jobApplicationId: string | undefined): void {
    if (!jobApplicationId) return;

    this.jobApplicationService.downloadCv(jobApplicationId).subscribe({
      next: (res: HttpResponse<Blob>) => {
        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.resumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (err) => {
        console.error('Error loading CV', err);
      }
    });

    this.showResume = true;
  }

  public applicateStepClicked(stepIndex: number): void {
    switch (stepIndex) {
      case JobApplicationStatus.Shortlisted:
        this.modalService.open(this.shortListedConfirmationModal, { centered: true, backdrop: 'static' });
        break;
      case JobApplicationStatus.InterviewScheduled:
        this.modalService.open(this.interviewScheduledModal, { centered: true, backdrop: 'static' });
        break;
      case JobApplicationStatus.Rejected:
        this.modalService.open(this.rejectJobApplicationModal, { centered: true, backdrop: 'static' });
        break;
      default:
        break;
    }
  }

  public onShortlistConfirmed(modal: any): void {
    this.isSaving = true;
    this.jobApplicationService.shortList(this.jobApplication?.id || '').pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          if (this.jobApplication) {
            this.jobApplication.status = JobApplicationStatus.Shortlisted;
            this.toastService.showSuccessMessage('Job application shortlisted successfully');
            modal.close('Yes');
          }
        },
        error: (err) => {
          console.error('Error shortlisting application', err);
        }
      });
  }

  public onRejectJobApplication(modal: any): void {
    if (this.rejectionForm.invalid) {
      this.rejectionForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    if (this.jobApplication && this.jobApplication.id) {
      this.jobApplicationService.reject(this.jobApplication.id, this.rejectionForm.value.reason).pipe(
        finalize(() => {
          this.isSaving = false;
          this.modalService.dismissAll();
        })).subscribe({
          next: () => {
            if (this.jobApplication) {
              this.jobApplication.status = JobApplicationStatus.Rejected;
            }
            this.toastService.showSuccessMessage('Job application rejected successfully');
            modal.close('Yes');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Rejecting Job application failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Job application ID is undefined, cannot reject');
    }
  }

}
