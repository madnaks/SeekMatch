import { Component, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isMenuItemVisible: boolean = false;
  showHeader: boolean = true;

  constructor(private offcanvasService: NgbOffcanvas, private translate: TranslateService, private router: Router) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route contains 'auth'
        const authRoutes = ['/log=in', '/sign-up', '/auth']; // Add your auth routes here
        this.showHeader = !authRoutes.some(route => event.url.includes(route));
      }
    });
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
