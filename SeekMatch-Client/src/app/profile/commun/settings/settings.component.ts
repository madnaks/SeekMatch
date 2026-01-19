import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Setting } from '@app/shared/models/setting';
import { LanguageService } from '@app/shared/services/language.service';
import { SettingService } from '@app/shared/services/setting.service';
import { ToastService } from '@app/shared/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {

  currentSetting: Setting | null = null;
  settingForm: FormGroup;
  isLoading: boolean = true;
  isSaving: boolean = false;

  constructor(
    private settingService: SettingService,
    private fb: NonNullableFormBuilder,
    private translate: TranslateService,
    private toastService: ToastService,
    private languageService: LanguageService) {
    this.settingForm = this.initSettingForm();
  }

  ngOnInit(): void {
    this.settingService.loadSetting().subscribe(setting => {
      this.currentSetting = new Setting(setting)
    });
    this.initSettingFormValues();
  }

  private initSettingForm(): FormGroup {
    return this.fb.group({
      language: ['']
    });
  }

  private initSettingFormValues() {
    this.settingService.loadSetting().subscribe(setting => {
      this.settingForm.patchValue({
        language: setting?.language || this.languageService.getBrowserLanguageCode()
      });

      this.isLoading = false;
    });
  }

  saveSetting() {
    if (this.settingForm.valid) {
      this.isSaving = true;
      const settingData = this.settingForm.value;
      this.settingService.updateSetting(settingData).subscribe({
        next: () => {
          this.translate.use(settingData.language);
          this.isSaving = false;
          this.toastService.showSuccessMessage('Setting updated successfully!');
        }
      });
    } else {
      this.isSaving = false;
    }
  }

}
