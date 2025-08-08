import { Component, Input } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-express-apply-modal',
  templateUrl: './express-apply-modal.component.html',
  styleUrl: './express-apply-modal.component.scss'
})
export class ExpressApplyModalComponent {
  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };

  public expressApplyMode: boolean = false;
  public expressApplyForm: FormGroup;

  constructor(private fb: NonNullableFormBuilder) {
    this.expressApplyForm = this.initForm();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.email]],
      phone: ['']
    });
  }

  public dismiss(reason: string) {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }
}
