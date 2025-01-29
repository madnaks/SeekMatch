import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-talent-preview-modal',
  templateUrl: './talent-preview-modal.component.html',
  styleUrl: './talent-preview-modal.component.scss'
})
export class TalentPreviewModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  constructor() {
  }

  public dismiss(reason: string): void {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
