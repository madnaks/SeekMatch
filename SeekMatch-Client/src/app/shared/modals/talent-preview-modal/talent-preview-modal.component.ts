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
  @Input() selectedTalentId: string = "";
  
  public selectedTalent: Talent | null = null;

  constructor(private talentService: TalentService) {
  }

  ngOnInit(): void {
    if (this.selectedTalentId !== "") {
      this.talentService.getById(this.selectedTalentId).subscribe(talent => {
        this.selectedTalent = new Talent(talent);
      });
    }
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
