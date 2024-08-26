import { Component, TemplateRef } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(private offcanvasService: NgbOffcanvas) {
  }

  openOffcanvas(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }

  closeOffcanvas() {
    this.offcanvasService.dismiss();
  }

}
