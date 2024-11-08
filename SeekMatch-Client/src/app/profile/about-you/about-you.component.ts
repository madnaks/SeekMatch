import { Component } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TalentService } from '../../shared/services/talent.service';
import { finalize } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { ToastService } from '../../shared/services/toast.service';
import { ToastType } from '../../shared/enums/enums';

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
    private talentService: TalentService, 
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

      this.talentService.saveAboutYouData(aboutYouData).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: (response) => {
          console.log('Profile saved successfully!', response);
        },
        error: (error) => {
          console.error('Error saving profile!', error);
        }
      })
    } else {
      console.log('Form is not valid');
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
    this.talentService.getProfile().subscribe(talent => {
      const dateOfBirth = talent.dateOfBirth === '0001-01-01' ? null : talent.dateOfBirth;

      this.aboutYouForm.patchValue({
        firstName: talent.firstName,
        lastName: talent.lastName,
        profileTitle: talent.profileTitle,
        dateOfBirth: dateOfBirth,
        address: talent.address,
        email: talent.email,
        phone: talent.phone
      });

      if (talent.profilePicture) {
        this.profilePicture = `data:image/jpeg;base64,${talent.profilePicture}`;
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

      this.talentService.uploadProfilePicture(file).subscribe({
        next: () => {
          this.defaultProfilePicture  = false;
          this.toastService.show('Data saved successfully!', ToastType.Success);
        },
        error: (err) => console.error('Error uploading profile picture', err)
      });

    }
  }

  removeImage(): void {
    this.talentService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
        this.defaultProfilePicture  = true;
        this.toastService.show('Profile picture removed successfully!', ToastType.Success);
      },
      error: (err) => console.error('Error deleting profile picture', err)
    });

  }

}
