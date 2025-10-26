import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';
import { Resume } from '@app/shared/models/resume';
import { ResumeService } from '@app/shared/services/resume.service';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrl: './resume.component.scss'
})
export class ResumeComponent implements OnInit {

  public resumes: Resume[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedResume: Resume = new Resume;
  
  private deleteModal: NgbModalRef | undefined;
  
  constructor(
    private modalService: NgbModal, 
    private resumeService: ResumeService, 
    private translate: TranslateService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getResumes();
  }

  //#region : Modal functions
  public open(content: any, resume?: Resume): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    if (resume != undefined) {
      this.selectedResume = resume;
    }
  }

  public openDeleteModal(content: any, resume: Resume): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedResume = resume;
  }

  private closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }
  //#endregion

  private getResumes(): void {
    this.resumeService.getAll().subscribe((resumes) => {
      this.resumes = resumes;
      this.isLoading = false;
    });
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Resume created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Resume updated successfully');
    }
    this.getResumes();
  }

  public deleteResume(): void {
    this.isSaving = true;
    if (this.selectedResume.id) {
      this.resumeService.delete(this.selectedResume.id).pipe(
        finalize(() => {
          this.isSaving = false;
        })).subscribe({
          next: () => {
            this.closeModal();
            this.getResumes();
            this.toastService.showSuccessMessage('Resume deleted successfully');
          },
          error: (error) => {
            this.toastService.showErrorMessage('Deleting Resume failed', error);
          }
        });
    } else {
      this.toastService.showErrorMessage('Resume ID is undefined, cannot delete');
    }
  }

}
