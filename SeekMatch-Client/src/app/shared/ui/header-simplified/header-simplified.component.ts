import { Component } from '@angular/core';
import { LanguageService } from '@app/shared/services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-simplified',
  templateUrl: './header-simplified.component.html',
  styleUrl: './header-simplified.component.scss'
})
export class HeaderSimplifiedComponent {

  constructor(public translate: TranslateService, private languageService: LanguageService) {
  }

  changeLanguage() {
    const language = this.translate.currentLang === 'fr' ? 'en' : 'fr';
    this.languageService.saveLanguageCode(language);
    this.translate.use(language);
  }

}
