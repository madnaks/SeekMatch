import { Component, Input, OnInit } from '@angular/core';
import { JobOffer } from '../../../shared/models/job-offer';
import { JobType, UserRole } from '../../../shared/enums/enums';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrl: './job-details.component.scss'
})
export class JobDetailsComponent implements OnInit {
 
  @Input() jobOffer: JobOffer | null = null;
  userRole: UserRole | null = null;
  canApply: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    // Only Talent can Apply
    this.canApply = this.userRole == UserRole.Talent;
  }
 
  public getJobTypeName(type: JobType): string {
    return JobType[type];
  }
  
  public sanitizedDescription(description: string) {
    const normalizedDescription = description.replace(/&nbsp;/g, ' ');
    return this.sanitizer.bypassSecurityTrustHtml(normalizedDescription);
  }
}
  