import { Component, Input, ViewEncapsulation } from '@angular/core';
import { JobOffer } from '../../../../shared/models/job-offer';
import { JobType, WorkplaceType } from '@app/shared/enums/enums';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared/shared.module';
import { LoaderComponent } from "@app/shared/ui";

@Component({
  selector: 'app-job-offer-preview-modal',
  templateUrl: './job-offer-preview-modal.component.html',
  styleUrl: './job-offer-preview-modal.component.scss',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedModule, LoaderComponent]
})
export class JobOfferPreviewModalComponent {

  @Input() isLoading: boolean = false;
  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedJobOffer: JobOffer | undefined = undefined;

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  public getJobTypeName = (type: JobType): string =>
    JobType[type];

  public getWorkplaceTypeName = (workplaceType: WorkplaceType): string =>
    WorkplaceType[workplaceType];

}