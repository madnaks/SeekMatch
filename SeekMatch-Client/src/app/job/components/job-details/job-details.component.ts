import { Component, Input } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobType } from '../../../shared/enums/enums';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent {

  @Input() jobOffer: JobOffer | null = null;

  public getJobTypeName(type: JobType): string {
    return JobType[type];
  }

}
