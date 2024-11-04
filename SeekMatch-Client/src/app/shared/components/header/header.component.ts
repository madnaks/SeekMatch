import { Component, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { TalentService } from '../../services/talent.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isMenuItemVisible: boolean = false;
  showHeader: boolean = true;
  isAuthenticated: boolean = false;
  profilePicture: string | null = null;

  constructor(
    private offcanvasService: NgbOffcanvas,
    public translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private talentService: TalentService) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        const authRoutes = ['/log=in', '/sign-up', '/auth'];

        this.showHeader = !authRoutes.some(route => event.url.includes(route));
        this.isAuthenticated = this.authService.isAuthenticated();

        if (this.isAuthenticated) {
          this.talentService.getProfile().subscribe(talent => {

            if (talent.profilePicture) {
              this.profilePicture = `data:image/jpeg;base64,${talent.profilePicture}`;
            } else {
              this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
            }
            
          });
        }
      }
    });
  }

  public openOffcanvas(content: TemplateRef<any>): void {
    this.offcanvasService.open(content, { position: 'end' });
  }

  public closeOffcanvas(): void {
    this.offcanvasService.dismiss();
  }

  public changeLanguage() {
    if (this.translate.currentLang == 'en') {
      this.translate.use('fr');
    } else {
      this.translate.use('en');
    }
  }

  public open(content: any) {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

}
