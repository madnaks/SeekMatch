import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder } from '@angular/forms';
import { finalize } from 'rxjs';
import { jobTypes } from '../../../shared/constants/constants';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Recruiter } from '../../../shared/models/recruiter';
import { RepresentativeService } from '../../../shared/services/representative.service';

@Component({
  selector: 'app-recruiter-team-modal',
  templateUrl: './recruiter-team-modal.component.html',
  styleUrl: './recruiter-team-modal.component.scss'
})
export class RecruiterTeamModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedRecruiter: Recruiter | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  public messageClosed: boolean = false;
  public isSaving: boolean = false;
  public recruiterForm: FormGroup;
  public jobTypesList = jobTypes;
  public bsConfig?: Partial<BsDatepickerConfig>;

  constructor(
    private fb: NonNullableFormBuilder,
    private representativeService: RepresentativeService,
    private toastService: ToastService) {
    this.recruiterForm = this.initRecruiterFormForm();
  }

  ngOnInit() {
    if (this.selectedRecruiter != undefined) {
      this.populateForm(this.selectedRecruiter);
    }
  }

  private initRecruiterFormForm(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      email: ['']
    });
  }

  private populateForm(recruiter: Recruiter): void {
    this.recruiterForm.patchValue({
      firstName: recruiter.firstName,
      lastName: recruiter.lastName,
      email: recruiter.email
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.recruiterForm.valid) {
      
      this.isSaving = true;

      const formValues = this.recruiterForm.value;
      let recruiter = new Recruiter(formValues);

      this.create(recruiter);

    } else {
      this.recruiterForm.markAllAsTouched();
    }
  }
  //#endregion


  private create(recruiter: Recruiter): void {

    this.representativeService.createRecruiter(recruiter).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Creation of job offer failed', error);
        }
      });
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}