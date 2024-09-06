import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isMenuItemVisible: boolean = false;

  constructor(private offcanvasService: NgbOffcanvas, private translate: TranslateService) {
  }

  public openOffcanvas(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }

  public closeOffcanvas(): void {
    this.offcanvasService.dismiss();
  }

  changeLanguage() {
    if (this.translate.currentLang == 'en') {
      this.translate.use('fr');
    } else {
      this.translate.use('en');
    }
  }

}
