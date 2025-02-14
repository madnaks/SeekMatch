import { Component, Input, OnInit } from '@angular/core';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';
import { SafeUrl } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../constants/constants';
import { Education } from '../../models/education';
import { Experience } from '../../models/experience';

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

  public currentTalent: Talent | null = null;
  public profilePicture: SafeUrl | string | null = null;
  public isSummaryExpanded = false;

  public monthOptions = months;

  constructor(
    private talentService: TalentService,
    private translate: TranslateService) {
  }

  ngOnInit(): void {
    if (this.selectedTalentId !== "") {
      this.talentService.getById(this.selectedTalentId).subscribe(talent => {
        this.currentTalent = new Talent(talent);
      });
    } else if (this.selectedTalent !== null) {
      this.currentTalent = this.selectedTalent;
    }

    if (this.currentTalent?.profilePicture) {
      this.profilePicture = `data:image/jpeg;base64,${this.currentTalent.profilePicture}`;
    } else {
      this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
    }
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
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

}
