import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/services/toast.service';
import { RepresentativeService } from '../../../shared/services/representative.service';

@Component({
  selector: 'app-representative-profile',
  templateUrl: './representative-profile.component.html',
  styleUrl: './representative-profile.component.scss'
})
export class RepresentativeProfileComponent {

  aboutYouForm: FormGroup;
  isLoading: boolean = true;
  isSaving: boolean = false;

  profilePicture: SafeUrl | string | null = null;
  defaultProfilePicture: boolean = true;

  constructor(
    private fb: NonNullableFormBuilder, 
    private representativeService: RepresentativeService, 
    private toastService: ToastService) {
    this.aboutYouForm = this.initAboutYouForm();
  }

  ngOnInit(): void {
    this.initAboutYouFormValues();
  }

  saveProfile() {
    if (this.aboutYouForm.valid) {
      this.isSaving = true;
      const aboutYouData = this.aboutYouForm.value;

      this.representativeService.saveAboutYouData(aboutYouData).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: () => {
          this.toastService.showSuccessMessage('Profile saved successfully!');
        },
        error: (error) => {
          this.toastService.showErrorMessage('Error saving profile!', error);
        }
      })
    } else {
      this.toastService.showErrorMessage('Form is not valid');
    }
  }

  private initAboutYouForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      position: [''],
      email: [{ value: '', disabled: true }, [Validators.email]],
      phone: [''],
    });
  }

  private initAboutYouFormValues() {
    this.representativeService.getProfile().subscribe(representative => {

      this.aboutYouForm.patchValue({
        firstName: representative.firstName,
        lastName: representative.lastName,
        position: representative.position,
        email: representative.email,
        phone: representative.phone
      });

      if (representative.profilePicture) {
        this.profilePicture = `data:image/jpeg;base64,${representative.profilePicture}`;
        this.defaultProfilePicture = false;
      } else {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
      }

      this.isLoading = false;
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.profilePicture = reader.result;
      };

      reader.readAsDataURL(file);

      this.representativeService.uploadProfilePicture(file).subscribe({
        next: () => {
          this.defaultProfilePicture  = false;
          this.toastService.showSuccessMessage('Profile picture saved successfully!');
        },
        error: (error) => this.toastService.showErrorMessage('Error uploading profile picture!', error)
      });

    }
  }

  removeImage(): void {
    this.representativeService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
        this.defaultProfilePicture  = true;
        this.toastService.showSuccessMessage('Profile picture removed successfully!');
      },
      error: (error) => this.toastService.showErrorMessage('Error deleting profile picture!', error)
    });

  }

}
