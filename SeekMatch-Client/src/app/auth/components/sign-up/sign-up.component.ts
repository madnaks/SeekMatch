import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserRole } from '../../../shared/enums/enums';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  // create a variable and assing to it UserRole Enum so that it can be user in html
  UserRole = UserRole;
  selectedUserRole: UserRole = UserRole.Talent;

  constructor(private modalService: NgbModal) {
  }

  open(content: any, userRole: UserRole) {
    this.selectedUserRole = userRole;
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

}