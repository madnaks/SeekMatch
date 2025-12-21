import { Component, Input, ViewEncapsulation } from '@angular/core';
import { JobOffer } from '../../../../shared/models/job-offer';
import { TranslateModule } from '@ngx-translate/core';
import { JobType, WorkplaceType } from '@app/shared/enums/enums';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-offer-preview-modal',
  templateUrl: './job-offer-preview-modal.component.html',
  styleUrl: './job-offer-preview-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [TranslateModule, CommonModule]
})
export class JobOfferPreviewModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobOffer: JobOffer | undefined = undefined;

  constructor(private sanitizer: DomSanitizer) {
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

  public sanitizedDescription(description: string) {
    const normalizedDescription = description.replace(/&nbsp;/g, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(normalizedDescription);
  } 

}