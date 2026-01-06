import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { JobApplicationStatus, ModalActionType } from '@app/shared/enums/enums';
import { HttpResponse } from '@angular/common/http';
import { ToastService } from '@app/shared/services/toast.service';
import { Education, Experience, JobApplication, Talent } from '@app/shared/models';
import { EducationService, ExperienceService, JobApplicationService, TalentService } from '@app/shared/services';

@Component({
  selector: 'app-job-application-details-modal',
  templateUrl: './job-application-details-modal.component.html',
  styleUrl: './job-application-details-modal.component.scss'
})
export class JobApplicationDetailsModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedTalent: Talent | null = null;
  @Input() selectedTalentId: string = "";
  @Input() jobApplication: JobApplication | null = null;

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
    private talentService: TalentService,
    private jobApplicationService: JobApplicationService,
    private educationService: EducationService,
    private experienceService: ExperienceService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService,
    private toastService: ToastService) {
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
      error: (error) => {
        this.toastService.showErrorMessage(
          'Error loading Resume',
          error
        );
      }
    });

    this.showResume = true;
  }

  public onTabChange(activeId: string | number): void {
    if (activeId === 'resumes') {
      this.onShowResume(this.jobApplication?.id);
    }
  }
}
