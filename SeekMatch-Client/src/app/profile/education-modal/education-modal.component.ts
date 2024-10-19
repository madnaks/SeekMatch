import { Component, Input } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-education-modal',
  templateUrl: './education-modal.component.html',
  styleUrl: './education-modal.component.scss'
})
export class EducationModalComponent {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  isSaving: boolean = false;
  educationForm: FormGroup;

  constructor(private fb: NonNullableFormBuilder) {
    this.educationForm = this.initEducationForm();
  }

  private initEducationForm(): FormGroup {
    return this.fb.group({
      institution: ['', Validators.required],
      diploma: [''],
      domain: [''],
    });
  }

  public onSubmit(): void {

  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

}
