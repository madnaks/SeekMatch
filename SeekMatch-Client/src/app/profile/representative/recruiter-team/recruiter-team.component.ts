import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { months } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';
import { Recruiter } from '../../../shared/models/recruiter';
import { RepresentativeService } from '../../../shared/services/representative.service';

@Component({
  selector: 'app-recruiter-team',
  templateUrl: './recruiter-team.component.html',
  styleUrl: './recruiter-team.component.scss'
})
export class RecruiterTeamComponent implements OnInit {

  public monthOptions = months;
  public recruiters: Recruiter[] = [];
  public isLoading: boolean = true;
  public isSaving: boolean = false;
  public selectedRecruiter: Recruiter = new Recruiter;
  
  private deleteModal: NgbModalRef | undefined;
  
  constructor(
    private modalService: NgbModal, 
    private representativeService: RepresentativeService,
    private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getRecruiters();
  }

  private getRecruiters(): void {
    this.representativeService.getRecruiters().subscribe((recruiters) => {
      this.recruiters = recruiters;
      this.isLoading = false;
    });
  }

  public deleteRecruiter(): void {
    // this.isSaving = true;
    // if (this.selectedRecruiter.id) {
    //   this.representativeService.deleteRecruiter(this.selectedRecruiter.id).pipe(
    //     finalize(() => {
    //       this.isSaving = false;
    //     })).subscribe({
    //       next: () => {
    //         this.closeModal();
    //         this.getJobOffers();
    //         this.toastService.showSuccessMessage('Job offer deleted successfully');
    //       },
    //       error: (error) => {
    //         this.toastService.showErrorMessage('Deleting Job offer failed', error);
    //       }
    //     });
    // } else {
    //   this.toastService.showErrorMessage('Job offer ID is undefined, cannot delete');
    // }
  }

  //#region : Modal functions
  public open(content: any, recruiter?: Recruiter): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    if (recruiter != undefined) {
      this.selectedRecruiter = recruiter;
    }
  }

  public openDeleteModal(content: any, experience: Recruiter): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.selectedRecruiter = experience;
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Recruiter created successfully');
    } 
    this.getRecruiters();
  }

  private closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }
  //#endregion
}
