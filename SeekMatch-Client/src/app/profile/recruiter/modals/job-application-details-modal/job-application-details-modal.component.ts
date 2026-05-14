import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { JobApplicationStatus, ModalActionType } from '@app/shared/enums/enums';
import { HttpResponse } from '@angular/common/http';
import { ToastService } from '@app/shared/services/toast.service';
import { Education, Experience, JobApplication, Talent } from '@app/shared/models';
import { EducationService, ExperienceService, JobApplicationService, TalentService } from '@app/shared/services';
import { JobApplicationStep } from '@app/shared/models/job-application-step';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

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
  @Input() jobApplicationId: string | undefined = "";

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  public currentTalent: Talent | null = null;
  public currentJobApplication: JobApplication | null = null;
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
    private toastService: ToastService,
    private translate: TranslateService) {
  }

  public async ngOnInit(): Promise<void> {
    await this.loadJobApplicationDetails();
    // If came from job offer applications list
    if (this.currentJobApplication) {
      if (this.currentJobApplication.expressApplication && this.selectedTalent == null) {
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

  public async loadJobApplicationDetails(): Promise<void> {
    if (!this.jobApplicationId) return;

    try {
      this.currentJobApplication = await firstValueFrom(
        this.jobApplicationService.getById(this.jobApplicationId)
      );
    } catch (error) {
      this.toastService.showErrorMessage(
        'Error loading job application details',
        error
      );
    }
  }

  public get orderedJobApplicationSteps(): JobApplicationStep[] {
    return [...(this.currentJobApplication?.jobApplicationSteps ?? [])]
      .sort((a, b) => Number(a.status) - Number(b.status));
  }

  public getJobApplicationStepStatusKey = (status: JobApplicationStatus): string =>
    this.translate.instant(`Enum.JobApplicationStatus.${JobApplicationStatus[status]}`);

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

  public hasLongSummary = (): boolean =>
    !!this.currentTalent?.summary && this.currentTalent.summary.length > 150;

  public getEducationDuration = (education: Education): string =>
    this.educationService.getDurationString(education);

  public getExperienceDuration = (experience: Experience): string =>
    this.experienceService.getDurationString(experience);

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
      this.onShowResume(this.currentJobApplication?.id);
    }
  }

  public refreshJobApplication(): void {
    this.loadJobApplicationDetails();
    this.modalActionComplete.emit(ModalActionType.Refresh);
  }

}
