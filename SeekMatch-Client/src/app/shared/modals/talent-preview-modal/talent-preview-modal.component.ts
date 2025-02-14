import { Component, Input, OnInit } from '@angular/core';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';
import { SafeUrl } from '@angular/platform-browser';

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

  constructor(private talentService: TalentService) {
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

}
