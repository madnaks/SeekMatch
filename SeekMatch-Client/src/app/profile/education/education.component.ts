import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EducationService } from '../../shared/services/education.service';
import { Education } from '../../shared/models/education';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {

  educations: Education[] = [];
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private educationService: EducationService) {
  }

  ngOnInit(): void {
    this.getEducations();
  }

  public open(content: any): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
  }

  private getEducations(): void {
    this.educationService.getAll().subscribe((newEducations) => {
      this.educations = [...this.educations, ...newEducations];
      this.isLoading = false;
    });
  }

}
