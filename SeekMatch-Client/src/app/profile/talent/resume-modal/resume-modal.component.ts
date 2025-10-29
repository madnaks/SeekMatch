import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ResumeService } from '../../../shared/services/resume.service';
import { Resume } from '../../../shared/models/resume';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { ModalActionType } from '../../../shared/enums/enums';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-resume-modal',
  templateUrl: './resume-modal.component.html',
  styleUrl: './resume-modal.component.scss'
})
export class ResumeModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedResume: Resume | undefined = undefined;
  @Input() onlyResume: boolean = false;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  public resumeUrl: SafeResourceUrl | null = null;
  public isSaving: boolean = false;
  public updateMode: boolean = false;
  public resumeForm: FormGroup = new FormGroup({});

  constructor(
    private fb: NonNullableFormBuilder,
    private resumeService: ResumeService,
    private toastService: ToastService,
    private sanitizer: DomSanitizer) {
    }
    
    ngOnInit() {
    this.updateMode = this.selectedResume != undefined;
    this.resumeForm = this.initResumeForm();
    if (this.updateMode) {
      this.populateForm(this.selectedResume!);
      this.downloadResume(this.selectedResume!.id!);
    }
  }

  private initResumeForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      isPrimary: [{ value: false, disabled: this.onlyResume }],
      resume: [null, this.updateMode ? [] : [Validators.required]]
    });
  }

  private populateForm(resume: Resume): void {
    this.resumeForm.patchValue({
      title: resume.title,
      isPrimary: resume.isPrimary
    });
  }

  private downloadResume(resumeId: string): void {
    this.resumeService.downloadResume(resumeId).subscribe({
      next: (res: HttpResponse<Blob>) => {
        const blob = new Blob([res.body!], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        this.resumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      },
      error: (err) => {
        console.error('Error loading Resume', err);
      }
    });
  }

  //#region : Form controls events 
  public onSubmit(): void {
    if (this.resumeForm.valid) {
      this.isSaving = true;
      if (this.updateMode) {
        this.update();
      } else {
        this.create();
      }
    } else {
      this.resumeForm.markAllAsTouched();
    }
  }
  //#endregion


  private create(): void {
    const formValues = this.resumeForm.value;

    // Build FormData for multipart/form-data
    const formData = new FormData();
    formData.append('title', formValues.title);
    formData.append('isPrimary', formValues.isPrimary);
    if (formValues.resume) {
      formData.append('resume', formValues.resume);
    }

    this.resumeService.create(formData).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Create);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Creation of resume failed', error);
        }
      });
  }

  private update(): void {
    const formValues = this.resumeForm.value;

    let resume = new Resume(formValues);
    resume.id = this.selectedResume?.id;

    this.resumeService.update(resume).pipe(
      finalize(() => {
        this.isSaving = false;
      })).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Update);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Update of resume failed', error);
        }
      });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.resumeForm.patchValue({ resume: file });
      this.resumeForm.get('resume')?.updateValueAndValidity();
    }
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}