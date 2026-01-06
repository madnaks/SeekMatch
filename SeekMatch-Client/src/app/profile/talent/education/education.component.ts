import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EducationService } from '../../../shared/services/education.service';
import { Education } from '../../../shared/models/education';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrl: './education.component.scss'
})
export class EducationComponent implements OnInit {

  public educations: Education[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedEducation: Education = new Education;

  private deleteModal: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private educationService: EducationService,
    private translate: TranslateService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getEducations();
  }

  //#region : Modal functions
  public open(content: any, education?: Education): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    if (education != undefined) {
      this.selectedEducation = education;
    }
  }

  public openDeleteModal(content: any, education: Education): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedEducation = education;
  }

  private closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }
  //#endregion

  private getEducations(): void {
    this.educationService.getAll().subscribe((educations) => {
      this.educations = educations;
      this.isLoading = false;
    });
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Education created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Education updated successfully');
    }
    this.getEducations();
  }

  public deleteEducation(): void {
    this.isSaving = true;
    if (this.selectedEducation.id) {
      this.educationService.delete(this.selectedEducation.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.closeModal();
            this.getEducations();
            this.toastService.showSuccessMessage('Education deleted successfully');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Deleting Education failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Education ID is undefined, cannot delete');
    }
  }

  public getEducationDuration(education: Education): string {
    return this.educationService.getDurationString(education);
  }

}
