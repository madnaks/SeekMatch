import { Component } from '@angular/core';
import { Setting } from '@app/shared/models/setting';
import { SettingService } from '@app/shared/services/setting.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  currentSetting: Setting | null = null;

  constructor(private settingService: SettingService) { }

  ngOnInit(): void {
    this.settingService.loadSetting().subscribe(setting => {
      this.currentSetting = new Setting(setting)
    });
  }

}
