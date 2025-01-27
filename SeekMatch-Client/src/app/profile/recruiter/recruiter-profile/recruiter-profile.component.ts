import { Component } from '@angular/core';

@Component({
  selector: 'app-recruiter-profile',
  templateUrl: './recruiter-profile.component.html',
  styleUrl: './recruiter-profile.component.scss'
})
export class RecruiterProfileComponent {
  jobMenuOpen = true;

  toggleJobMenu() {
    this.jobMenuOpen = !this.jobMenuOpen;
  }

}
