import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header-simplified',
  templateUrl: './header-simplified.component.html',
  styleUrl: './header-simplified.component.scss'
})
export class HeaderSimplifiedComponent {

  constructor(public translate: TranslateService) {
  }

  changeLanguage() {
    if (this.translate.currentLang == 'en') {
      this.translate.use('fr');
    } else {
      this.translate.use('en');
    }
  }

}
