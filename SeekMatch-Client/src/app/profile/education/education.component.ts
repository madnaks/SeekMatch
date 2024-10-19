import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent {

  constructor(private modalService: NgbModal) {
  }

  open(content: any) {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

}
