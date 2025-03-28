import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { finalize } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../../shared/services/toast.service';
import { RepresentativeService } from '../../../shared/services/representative.service';

@Component({
  selector: 'app-about-you',
  templateUrl: './about-you.component.html',
  styleUrl: './about-you.component.scss'
})
export class AboutYouComponent {

  aboutYouForm: FormGroup;
  bsConfig?: Partial<BsDatepickerConfig>;
  isLoading: boolean = true;
  isSaving: boolean = false;

  profilePicture: SafeUrl | string | null = null;
  defaultProfilePicture: boolean = true;

  constructor(
    private fb: NonNullableFormBuilder, 
    private representativeService: RepresentativeService, 
    private toastService: ToastService) {
    this.aboutYouForm = this.initAboutYouForm();
    this.configureDatePicker();
  }

  ngOnInit(): void {
    this.initAboutYouFormValues();
  }

  saveProfile() {
    if (this.aboutYouForm.valid) {
      this.isSaving = true;
      const aboutYouData = this.aboutYouForm.value;
      // Check if dateOfBirth has a value and is not null
      if (aboutYouData.dateOfBirth) {

        // Extract 'yyyy-MM-dd'
        const formattedDateOfBirth = aboutYouData.dateOfBirth instanceof Date
          ? aboutYouData.dateOfBirth.toISOString().split('T')[0]
          : aboutYouData.dateOfBirth;

        aboutYouData.dateOfBirth = formattedDateOfBirth;
      }

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

  private configureDatePicker(): void {
    this.bsConfig = Object.assign({}, {
      containerClass: 'theme-blue',
      dateInputFormat: 'YYYY-MM-DD',
      isAnimated: true,
      showWeekNumbers: false
    });
  }

  private initAboutYouForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      profileTitle: [''],
      dateOfBirth: [null],
      email: [{ value: '', disabled: true }, [Validators.email]],
      address: [''],
      phone: [''],
      city: [''],
      zip: ['']
    });
  }

  private initAboutYouFormValues() {
    this.representativeService.getProfile().subscribe(representative => {
      const dateOfBirth = representative.dateOfBirth === '0001-01-01' ? null : representative.dateOfBirth;

      this.aboutYouForm.patchValue({
        firstName: representative.firstName,
        lastName: representative.lastName,
        profileTitle: representative.profileTitle,
        dateOfBirth: dateOfBirth,
        address: representative.address,
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
