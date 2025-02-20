import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Education } from '../../../shared/models/education';
import { ModalActionType } from '../../../shared/enums/enums';
import { TalentService } from '../../../shared/services/talent.service';
import { SafeUrl } from '@angular/platform-browser';
import { formatDateToISO } from '../../../shared/utils';
import { finalize } from 'rxjs';
import { ToastService } from '../../../shared/services/toast.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-edit-profile-modal',
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.scss'
})
export class EditProfileModalComponent implements OnInit {

  @Input() closeModal: () => void = () => { };
  @Input() dismissModal: (reason: string) => void = () => { };
  @Input() selectedEducation: Education | undefined = undefined;

  @Output() modalActionComplete = new EventEmitter<ModalActionType>();

  profileForm: FormGroup;
  isSaving: boolean = false;
  isLoading: boolean = true;
  // Profile picture propreties 
  profilePicture: SafeUrl | string | null = null;
  defaultProfilePicture: boolean = true;
  // Date Input propreties
  bsConfig?: Partial<BsDatepickerConfig>;
  // Phone Input propreties
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  selectedCountryISO = CountryISO.Tunisia;

  constructor(
    private fb: NonNullableFormBuilder,
    private talentService: TalentService,
    private toastService: ToastService) {
    this.profileForm = this.initAboutYouForm();
    this.configureDatePicker();
  }

  ngOnInit() {
    this.initProfileFormValues();
  }

  private initAboutYouForm(): FormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      profileTitle: [''],
      summary: [''],
      dateOfBirth: [null, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.email]],
      address: [''],
      phone: [''],
      city: [''],
      zip: ['']
    });
  }

  private initProfileFormValues() {
    this.talentService.getProfile().subscribe(talent => {
      const dateOfBirth = talent.dateOfBirth === '0001-01-01' ? null : talent.dateOfBirth;

      this.profileForm.patchValue({
        firstName: talent.firstName,
        lastName: talent.lastName,
        profileTitle: talent.profileTitle,
        summary: talent.summary,
        dateOfBirth: dateOfBirth,
        address: talent.address,
        email: talent.email,
        phone: talent.phone
      });

      this.selectedCountryISO = this.getCountryISO(talent.phone);

      if (talent.profilePicture) {
        this.profilePicture = `data:image/jpeg;base64,${talent.profilePicture}`;
        this.defaultProfilePicture = false;
      } else {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
      }

      this.isLoading = false;
    });
  }

  public saveProfile(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;
      const profileData = this.profileForm.value;
      const phoneNumberObject = profileData.phone;

      const formattedPhoneNumber = phoneNumberObject?.internationalNumber || '';
      profileData.dateOfBirth = formatDateToISO(profileData.dateOfBirth);
      profileData.phone = formattedPhoneNumber;

      this.talentService.saveProfile(profileData).pipe(
        finalize(() => {
          this.isSaving = false;
        })
      ).subscribe({
        next: () => {
          this.modalActionComplete.emit(ModalActionType.Update);
          this.dismiss();
        },
        error: (error) => {
          this.toastService.showErrorMessage('Error saving profile!', error);
          this.dismiss();
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
          this.defaultProfilePicture = false;
          this.toastService.showSuccessMessage('Profile picture saved successfully!');
        },
        error: (error) => this.toastService.showErrorMessage('Error uploading profile picture!', error)
      });

    }
  }

  removeImage(): void {
    this.talentService.deleteProfilePicture().subscribe({
      next: () => {
        this.profilePicture = "../../../assets/images/male-default-profile-picture.svg";
        this.defaultProfilePicture = true;
        this.toastService.showSuccessMessage('Profile picture removed successfully!');
      },
      error: (error) => this.toastService.showErrorMessage('Error deleting profile picture!', error)
    });
  }

  public dismiss(reason: string = '') {
    if (this.dismissModal) {
      this.dismissModal(reason);
    }
  }

  // Function to extract country ISO code from phone number
  getCountryISO(phoneNumber: string): CountryISO {
    if (phoneNumber.startsWith('+1')) {
      return CountryISO.Canada;
    } else if (phoneNumber.startsWith('+33')) {
      return CountryISO.France;
    }
    return CountryISO.Tunisia; // Default fallback
  }
}