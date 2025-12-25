import { Component, Input, ViewEncapsulation } from '@angular/core';
import { JobOffer } from '../../../../shared/models/job-offer';
import { JobType, WorkplaceType } from '@app/shared/enums/enums';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';

@Component({
  selector: 'app-job-offer-preview-modal',
  templateUrl: './job-offer-preview-modal.component.html',
  styleUrl: './job-offer-preview-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedModule]
})
export class JobOfferPreviewModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobOffer: JobOffer | undefined = undefined;

  constructor() {
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  public getJobTypeName(type: JobType): string {
    return JobType[type];
  }

  public getWorkplaceTypeName(workplaceType: WorkplaceType): string {
    return WorkplaceType[workplaceType];
  }

}