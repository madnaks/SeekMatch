import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EducationService } from '../../shared/services/education.service';
import { Education } from '../../shared/models/education';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../shared/constants/constants';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {

  public monthOptions = months;

  educations: Education[] = [];
  isLoading: boolean = true;
  isSaving: boolean = false;
  selectedEducation: Education = new Education;

  constructor(private modalService: NgbModal, private educationService: EducationService, private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.getEducations();
  }

  public open(content: any, education?: Education): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    if (education != undefined) {
      this.selectedEducation = education;
    }
  }

  public openDeleteModal(content: any, education: Education): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedEducation = education;
  }

  private getEducations(): void {
    this.educationService.getAll().subscribe((newEducations) => {
      this.educations = [...this.educations, ...newEducations];
      this.isLoading = false;
    });
  }

  public deleteEducation(): void {
    this.isSaving = true;
    if (this.selectedEducation.id) {
      this.educationService.delete(this.selectedEducation.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            window.location.reload();
          },
          error: (error) => {
            console.error('Deleting Education failed', error);
          }
        });
    } else {
      console.error('Education ID is undefined, cannot delete');
    }

  }

  public getMonthName(monthId: number): string {
    const month = this.monthOptions.find(m => m.id === monthId);
    return month ? this.translate.instant(month.value) : '';
  }

}
