import { Component, OnInit, TemplateRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';
import { TalentService } from '../../services/talent.service';
import { ToastService } from '../../services/toast.service';
import { UserRole } from '../../enums/enums';
import { RecruiterService } from '../../services/recruiter.service';
import { RepresentativeService } from '../../services/representative.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../models/notification';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public isLightMode = false;
  isMenuItemVisible: boolean = false;
  showHeader: boolean = true;
  isAuthenticated: boolean = false;
  userRole: UserRole | null = null;
  notifications: Notification[] = [];
  profilePicture: string | null = null;

  constructor(
    private offcanvasService: NgbOffcanvas,
    public translate: TranslateService,
    private router: Router,
    private modalService: NgbModal,
    private authService: AuthService,
    private talentService: TalentService,
    private recruiterService: RecruiterService,
    private representativeService: RepresentativeService,
    private toastService: ToastService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {

        const authRoutes = ['/log=in', '/sign-up', '/auth'];

        this.showHeader = !authRoutes.some(route => event.url.includes(route));
        this.isAuthenticated = this.authService.isAuthenticated();
        this.userRole = this.authService.getUserRole();

        if (this.isAuthenticated) {
          this.getUserNotification();
          this.getProfilePicture();
        }
      }
    });

    // Load theme from localStorage if available
    const savedTheme = localStorage.getItem('mode');
    if (savedTheme === 'ligth') {
      document.body.classList.add('light-mode');
      this.isLightMode = true;
    }
  }

  private getUserNotification() {
    this.notificationService.getUserNotifications().subscribe(notifications => {
      if (notifications) {
        this.notifications = notifications;
      } 
    });
  }

  private getProfilePicture() {
    switch (this.userRole) {
      case UserRole.Talent:
        this.talentService.getProfile().subscribe(talent => {
          if (talent.profilePicture) {
            this.profilePicture = `data:image/jpeg;base64,${talent.profilePicture}`;
          } else {
            this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
          }
        });
        break;
      case UserRole.Recruiter:
        this.recruiterService.getProfile().subscribe(recruiter => {
          if (recruiter.profilePicture) {
            this.profilePicture = `data:image/jpeg;base64,${recruiter.profilePicture}`;
          } else {
            this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
          }
        });
        break;
      case UserRole.Representative:
        this.representativeService.getProfile().subscribe(representative => {
          if (representative.profilePicture) {
            this.profilePicture = `data:image/jpeg;base64,${representative.profilePicture}`;
          } else {
            this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
          }
        });
        break;
      default:
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
        break;
    }
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

  public getProfileLink(): string | null {
    switch (this.userRole) {
      case UserRole.Talent:
        return "/profile/talent";
      case UserRole.Recruiter:
        return "/profile/recruiter";
      case UserRole.Representative:
        return "/profile/representative";
      default:
        return null
    }
  }

  public logout(): void {
    this.authService.logout();
    this.toastService.showSuccessMessage('Logout succed');
    this.router.navigate(['/home']);
  }

  public markAsRead(notificationId?: string): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.getUserNotification();
      }
    });
  }

  public toggleTheme(event: Event): void {
    this.isLightMode = (event.target as HTMLInputElement).checked;

    if (this.isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('mode', 'dark');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('mode', 'light');
    }
  }


}
