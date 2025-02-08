import { Component, Input, OnInit } from '@angular/core';
import { TalentService } from '../../services/talent.service';
import { Talent } from '../../models/talent';

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
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
