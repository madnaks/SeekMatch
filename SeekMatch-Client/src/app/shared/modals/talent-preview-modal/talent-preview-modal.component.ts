import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../constants/constants';
import { Education } from '../../models/education';
import { Experience } from '../../models/experience';
import { ModalActionType } from '@app/shared/enums/enums';
import { ExpressApplication } from '@app/shared/models/express-application';
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
  @Input() expressApplication: ExpressApplication | null = null;
  
  @Output() modalActionComplete = new EventEmitter<ModalActionType>();
  
  public currentTalent: Talent | null = null;
  public profilePicture: SafeUrl | string | null = null;
  public isSummaryExpanded = false;
  public isExpressApplication: boolean = false;
  public monthOptions = months;
  public resumeUrl: SafeResourceUrl | null = null;
  public showResume: boolean = false;

  constructor(
    private talentService: TalentService,
    private jobApplicationService: JobApplicationService,
    private sanitizer: DomSanitizer,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    if (this.expressApplication && this.selectedTalent == null) {
      this.isExpressApplication = true;
    } else {
      if (this.selectedTalentId !== "") {
        this.talentService.getById(this.selectedTalentId).subscribe(talent => {
          this.currentTalent = new Talent(talent);
        });
      } else if (this.selectedTalent !== null) {
        this.currentTalent = this.selectedTalent;
      }
    }

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


}
