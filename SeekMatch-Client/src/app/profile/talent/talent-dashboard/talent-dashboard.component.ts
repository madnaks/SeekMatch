import { Component } from '@angular/core';

@Component({
  selector: 'app-talent-dashboard',
  templateUrl: './talent-dashboard.component.html',
  styleUrl: './talent-dashboard.component.scss'
})
export class TalentDashboardComponent {
  jobMenuOpen = true;

  public toggleJobMenu(): void {
    this.jobMenuOpen = !this.jobMenuOpen;
  }
}
