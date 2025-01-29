import { Component } from '@angular/core';

@Component({
  selector: 'app-talent-profile',
  templateUrl: './talent-profile.component.html',
  styleUrl: './talent-profile.component.scss'
})
export class TalentProfileComponent {
  jobMenuOpen = true;

  public toggleJobMenu(): void {
    this.jobMenuOpen = !this.jobMenuOpen;
  }
}
