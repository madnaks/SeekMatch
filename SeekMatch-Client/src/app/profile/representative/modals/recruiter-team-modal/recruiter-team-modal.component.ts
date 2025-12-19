import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';
import { jobTypes } from '../../../../shared/constants/constants';
import { ToastService } from '../../../../shared/services/toast.service';
import { ModalActionType } from '../../../../shared/enums/enums';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Recruiter } from '../../../../shared/models/recruiter';
import { RepresentativeService } from '../../../../shared/services/representative.service';

@Component({
  selector: 'app-recruiter-team-modal',
  templateUrl: './recruiter-team-modal.component.html',
  styleUrl: './recruiter-team-modal.component.scss'
})
export class AddRecruiterTeamModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedRecruiter: Recruiter | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  public messageClosed: boolean = false;
  public isSaving: boolean = false;
  public recruiterForm: FormGroup;
  public jobTypesList = jobTypes;
  public bsConfig?: Partial<BsDatepickerConfig>;
  public updateMode: boolean = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private representativeService: RepresentativeService,
    private toastService: ToastService) {
    this.recruiterForm = this.initRecruiterFormForm();
  }

  ngOnInit() {
    if (this.selectedRecruiter != undefined) {
      this.populateForm(this.selectedRecruiter);
      this.updateMode = true;
      this.recruiterForm.get('email')?.disable();
    }
  }

  private initRecruiterFormForm(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      canDeleteJobOffers: [false]
    });
  }

  private populateForm(recruiter: Recruiter): void {
    this.recruiterForm.patchValue({
      firstName: recruiter.firstName,
      lastName: recruiter.lastName,
      email: recruiter.email,
      canDeleteJobOffers: recruiter.canDeleteJobOffers || false
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.recruiterForm.valid) {

      this.isSaving = true;

      if (this.updateMode) {
        this.update();
      } else {
        this.create();
      }

    } else {
      this.recruiterForm.markAllAsTouched();
    }
  }
  //#endregion


  private create(): void {
    const formValues = this.recruiterForm.value;
    let recruiter = new Recruiter(formValues);

    this.representativeService.createRecruiter(recruiter).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Creation of recruiter failed', error);
        }
      });
  }

  private update(): void {
    debugger
    const formValues = this.recruiterForm.value;
    let recruiter = new Recruiter(formValues);
    recruiter.id = this.selectedRecruiter?.id;

    this.representativeService.updateRecruiter(recruiter).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Update of recruiter failed', error);
        }
      });
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}