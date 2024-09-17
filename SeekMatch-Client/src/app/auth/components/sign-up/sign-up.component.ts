import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {

  selectedRole: string = '';

  constructor(private modalService: NgbModal) {
  }

  open(content: any, userRole: string) {
    this.selectedRole = userRole;
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }
}