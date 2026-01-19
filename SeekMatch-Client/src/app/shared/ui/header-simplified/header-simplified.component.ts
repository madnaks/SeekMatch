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
    if (this.translate.currentLang) {
      this.translate.use(this.translate.currentLang);
    } else {
      this.translate.use(this.languageService.getBrowserLanguageCode());
    }
  }

}
