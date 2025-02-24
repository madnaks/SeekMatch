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
import { GeonamesService } from '../../../shared/services/geonames.service';
import { countries } from '../../../shared/constants/constants';

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
  // Address
  countries = countries;
  provinces: { geonameId: number, toponymName:string }[] = [];
  cities: { name: string }[] = [];

  constructor(
    private fb: NonNullableFormBuilder,
    private talentService: TalentService,
    private toastService: ToastService,
    private geonamesService: GeonamesService) {
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
      dateOfBirth: [null],
      email: [{ value: '', disabled: true }, [Validators.email]],
      phone: [''],
      country: [''],
      province: [''],
      city: [''],
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
        email: talent.email,
        phone: talent.phone,
        country: talent.country,
        city: talent.city
      });

      // this.getCities(talent.country);

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

  //#region Phone Input Events
  public onPhoneCountryChange(): void {
    this.profileForm.patchValue({ phone: '' });
  }

  private getCountryISO(phoneNumber: string): CountryISO {
    if (phoneNumber.startsWith('+1')) {
      return CountryISO.Canada;
    } else if (phoneNumber.startsWith('+33')) {
      return CountryISO.France;
    }
    return CountryISO.Tunisia; // Default fallback
  }
  //#endregion

  //#region Address events
  public onCountrySelect(event: any): void {
    const countryCode = event.target.value;
    // this.getProvinces(countryCode);

    this.geonamesService.getCountryGeoId(countryCode).subscribe(geonameId => {
      if (geonameId) {
        this.geonamesService.getProvinces(geonameId).subscribe(provinces => {
          console.log(provinces);
          this.provinces = provinces;
        });
      }
    });

  }

  public onProvinceSelect(event: any): void {
    const provinceGeoId = event.target.value;
    this.geonamesService.getCities(provinceGeoId).subscribe(cities => {
      this.cities = cities;
    });
  }

  // private getCities(countryCode: string): void {
  //   if (!countryCode) {
  //     this.cities = [];
  //   } else {
  //     this.geonamesService.getCities(countryCode).subscribe(cities => {
  //       this.cities = cities.geonames;
  //     });
  //   }
  // }
  //#endregion

}