import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ExperienceService } from '../../shared/services/experience.service';
import { Experience } from '../../shared/models/experience';
import { TranslateService } from '@ngx-translate/core';
import { months } from '../../shared/constants/constants';
import { finalize } from 'rxjs';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss'
})
export class ExperienceComponent implements OnInit {

  public monthOptions = months;
  public experiences: Experience[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedExperience: Experience = new Experience;
  
  private deleteModal: NgbModalRef | undefined;
  
  constructor(
    private modalService: NgbModal, 
    private experienceService: ExperienceService, 
    private translate: TranslateService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getExperiences();
  }

  //#region : Modal functions
  public open(content: any, experience?: Experience): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    if (experience != undefined) {
      this.selectedExperience = experience;
    }
  }

  public openDeleteModal(content: any, experience: Experience): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedExperience = experience;
  }

  private closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }
  //#endregion

  private getExperiences(): void {
    this.experienceService.getAll().subscribe((experiences) => {
      this.experiences = experiences;
      this.isLoading = false;
    });
  }

  public deleteExperience(): void {
    this.isSaving = true;
    if (this.selectedExperience.id) {
      this.experienceService.delete(this.selectedExperience.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.closeModal();
            this.getExperiences();
          },
          error: (error) => {
            this.toastService.showErrorMessage('Deleting Experience failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Experience ID is undefined, cannot delete');
    }
  }

  public getMonthName(monthId: number): string {
    const month = this.monthOptions.find(m => m.id === monthId);
    return month ? this.translate.instant(month.value) : '';
  }

}
