import { Component, Input } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobType } from '../../../shared/enums/enums';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent {
 
  @Input() jobOffer: JobOffer | null = null;

  constructor(private sanitizer: DomSanitizer) {
  }
 
  public getJobTypeName(type: JobType): string {
    return JobType[type];
  }
  
  public sanitizedDescription(description: string) {
    const normalizedDescription = description.replace(/&nbsp;/g, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(normalizedDescription);
  }
}
  