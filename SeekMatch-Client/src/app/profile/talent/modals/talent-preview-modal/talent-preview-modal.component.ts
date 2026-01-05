import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Talent } from '../../../../shared/models/talent';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../../../shared/constants/constants';
import { Education } from '../../../../shared/models/education';
import { Experience } from '../../../../shared/models/experience';
import { JobApplicationStatus, ModalActionType } from '@app/shared/enums/enums';
import { JobApplicationService } from '@app/shared/services/job-application.service';
import { HttpResponse } from '@angular/common/http';

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

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  public currentTalent: Talent | null = null;
  public profilePicture: SafeUrl | string | null = null;
  public isSummaryExpanded = false;
  public isExpressApplication: boolean = false;
  public monthOptions = months;
  public resumeUrl: SafeResourceUrl | null = null;
  public showResume: boolean = false;
  public JobApplicationStatus = JobApplicationStatus;
  public isSaving: boolean = false;
  public jobApplicationSteps = [
    { icon: 'fas fa-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.SUBMITTED' },
    { icon: 'fa-solid fa-list-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.SHORTLISTED' },
    { icon: 'fa-solid fa-calendar-check', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.INTERVIEW-SCHEDULED' },
    { icon: 'fa-solid fa-handshake', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.HIRED' },
    { icon: 'fas fa-xmark', text: 'Talent.PreviewModal.JOB-APPLICATION-STEPS.REJECTED' }
  ];
  public platforms = [
    { name: 'Teams' },
    { name: 'Google Meet' },
    { name: 'Zoom' },
    { name: 'Other' }
  ];

  constructor(
    private jobApplicationService: JobApplicationService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    if (this.selectedTalent !== null) {
      this.currentTalent = this.selectedTalent;
      this.loadProfilePicture();
    }
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

    this.jobApplicationService.downloadResume(jobApplicationId).subscribe({
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
}
