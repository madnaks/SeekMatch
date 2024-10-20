import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EducationService } from '../../shared/services/education.service';
import { Education } from '../../shared/models/education';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../shared/constants/constants';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {

  public monthOptions = months;

  educations: Education[] = [];
  isLoading: boolean = true;

  constructor(private modalService: NgbModal, private educationService: EducationService, private translate: TranslateService) {
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

  public getMonthName(monthId: number): string {
    const month = this.monthOptions.find(m => m.id === monthId);
    return month ? this.translate.instant(month.value) : '';
  }

  public deleteEducation(): void {

  }

}
