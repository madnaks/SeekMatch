import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { JobApplicationStatus, ModalActionType } from '@app/shared/enums/enums';
import { HttpResponse } from '@angular/common/http';
import { EducationService, ExperienceService, JobApplicationService } from '@app/shared/services';
import { Education, Experience, Talent } from '@app/shared/models';

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
  public resumeUrl: SafeResourceUrl | null = null;
  public showResume: boolean = false;
  public JobApplicationStatus = JobApplicationStatus;
  public isSaving: boolean = false;

  constructor(
    private jobApplicationService: JobApplicationService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private educationService: EducationService,
    private experienceService: ExperienceService) {
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

  public getEducationDuration(education: Education): string {
    return this.educationService.getDurationString(education);
  }

  public getExperienceDuration(experience: Experience): string {
    return this.experienceService.getExperienceDuration(experience);
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
