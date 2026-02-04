import { Component, OnInit } from '@angular/core';
import { UserRole } from '@app/shared/enums/enums';
import { AuthService } from '@app/shared/services/auth.service';

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrl: './recruiter-profile.component.scss'
})
export class RecruiterProfileComponent implements OnInit {
  
  public userRole: UserRole = UserRole.Recruiter; 
  public UserRole = UserRole;
  
  private jobMenuOpen = true;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole() ?? UserRole.Recruiter;
  }

  public toggleJobMenu(): void {
    this.jobMenuOpen = !this.jobMenuOpen;
  }

}
