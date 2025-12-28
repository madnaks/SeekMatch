import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { months } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';
import { Recruiter } from '../../../shared/models/recruiter';
import { RepresentativeService } from '../../../shared/services/representative.service';
import { TableAction, TableColumn } from '@app/shared/form-controls/data-table/data-table.component';
import { ActivatedRoute, Router } from '@angular/router';
import { RecruiterService } from '@app/shared/services/recruiter.service';

@Component({
  selector: 'app-recruiter-details',
  templateUrl: './recruiter-details.component.html',
  styleUrl: './recruiter-details.component.scss'
})
export class RecruiterDetailsComponent {

  @ViewChild('viewRecruiterContent') viewRecruiterContent: any;
  @ViewChild('deleteRecruiterContent') deleteRecruiterContent: any;

  public isLoading: boolean = true;
  public recruiter: Recruiter | undefined = undefined;

  public monthOptions = months;
  public isSaving: boolean = false;
  public messageClosed: boolean = false;
  public recruitersColumns: TableColumn<Recruiter>[] = [];
  public recruitersActions: TableAction<Recruiter>[] = [];

  private deleteModal: NgbModalRef | undefined;

  constructor(
    private modalService: NgbModal,
    private recruiterService: RecruiterService,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute) {
    const nav = this.router.getCurrentNavigation();
    this.recruiter = nav?.extras?.state?.['recruiter'];

    if (!this.recruiter) {
      const id = this.route.snapshot.paramMap.get('id');
      // call API only if needed
      if (id) {
        this.recruiterService.getRecruiterById(id).subscribe((recruiter: Recruiter) => {
          this.recruiter = recruiter;
          // this.filteredJkobApplications = this.jobOffer.jobApplications;
          this.isLoading = false;
        });
      }
    }

    this.isLoading = false;
  }


  public goBack(): void {
    this.router.navigate(['profile/representative/recruiter-team']);
  }

  //#region : Modal functions
  public open(content: any, recruiter?: Recruiter): void {
    this.modalService.open(content, { centered: true, backdrop: 'static' });
    if (recruiter != undefined) {
      this.recruiter = recruiter;
    }
  }

  public openDeleteModal(content: any, recruiter: Recruiter): void {
    this.deleteModal = this.modalService.open(content, { centered: true, backdrop: 'static' });
    this.recruiter = recruiter;
  }

  public modalActionComplete(action: ModalActionType): void {
    if (action == ModalActionType.Create) {
      this.toastService.showSuccessMessage('Recruiter created successfully');
    } else if (action == ModalActionType.Update) {
      this.toastService.showSuccessMessage('Recruiter updated successfully');
    }
  }

  private closeModal(): void {
    if (this.deleteModal) {
      this.deleteModal.close();
      this.deleteModal = undefined;
    }
  }
  //#endregion
}
