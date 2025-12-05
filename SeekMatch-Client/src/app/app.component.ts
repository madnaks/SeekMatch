import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { HomeModule } from './home/home.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    HomeModule,
    RouterOutlet,
    SharedModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  public isHomePage: boolean = true;

  constructor(private translate: TranslateService, private router: Router) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.router.events.subscribe(() => {
      const currentRoute = this.router.routerState.snapshot.root.firstChild?.routeConfig?.path;
      this.isHomePage = currentRoute === '' || currentRoute === 'home';
    });

  }

}
